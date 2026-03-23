import { fileURLToPath } from 'url';
import { createClient } from './webflow-api.js';

const __filename = fileURLToPath(import.meta.url);
const isMain = process.argv[1] === __filename;

// -- Environment variables --

const { MODULAR_CLOUD_API_TOKEN, MODULAR_CLOUD_ORG, MODULAR_CLOUD_BASE_URL } = process.env;
const { WEBFLOW_API_TOKEN, WEBFLOW_SITE_ID, DRY_RUN } = process.env;
const dryRun = DRY_RUN === 'true';

let wf;
if (isMain) {
  if (!MODULAR_CLOUD_API_TOKEN || !MODULAR_CLOUD_ORG || !MODULAR_CLOUD_BASE_URL) {
    console.error(
      'Missing required env vars: MODULAR_CLOUD_API_TOKEN, MODULAR_CLOUD_ORG, MODULAR_CLOUD_BASE_URL'
    );
    process.exit(1);
  }
  if (!WEBFLOW_API_TOKEN || !WEBFLOW_SITE_ID) {
    console.error('Missing required env vars: WEBFLOW_API_TOKEN, WEBFLOW_SITE_ID');
    process.exit(1);
  }
  wf = createClient(WEBFLOW_API_TOKEN);
}

const modularHeaders = {
  'X-Yatai-Api-Token': MODULAR_CLOUD_API_TOKEN,
  'X-Yatai-Organization': MODULAR_CLOUD_ORG,
};

// -- Modular Cloud API --

async function fetchModelGarden() {
  const countRes = await fetch(`${MODULAR_CLOUD_BASE_URL}/api/v1/model_garden`, {
    headers: modularHeaders,
  });
  if (!countRes.ok) throw new Error(`Count request failed: ${countRes.status}`);
  const { total } = await countRes.json();

  const listRes = await fetch(`${MODULAR_CLOUD_BASE_URL}/api/v1/model_garden?count=${total}`, {
    headers: modularHeaders,
  });
  if (!listRes.ok) throw new Error(`List request failed: ${listRes.status}`);
  return listRes.json();
}

function transformModel(model) {
  const meta = model.metadata || {};
  const tags = meta.tags || [];
  return {
    display_name: model.display_name,
    name: model.name,
    description: model.description,
    model_id: model.model_id,
    logo_url: meta.logo_url,
    provider: meta.provider,
    modalities: meta.modalities,
    context_window: meta.context_window,
    total_params: meta.total_params,
    active_params: meta.active_params,
    precision: meta.precision,
    model_url: meta.model_url,
    isLive: Boolean(model.gateway_id),
    isNew: tags.includes('New'),
    isTrending: tags.includes('Trending'),
  };
}

// -- Field mapping --

export function toWebflowFields(model, modalities, categoryMap, logoField) {
  return {
    name: model.display_name || model.name,
    slug: model.name,
    'display-name': model.display_name || '',
    'model-id': model.model_id || '',
    logo: logoField,
    description: model.description || '',
    provider: model.provider || '',
    'context-window': model.context_window || '',
    'total-params': model.total_params || '',
    'active-params': model.active_params || '',
    precision: model.precision || '',
    'model-url': model.model_url || '',
    live: model.isLive,
    new: model.isNew,
    trending: model.isTrending,
    modalities: modalities.map((m) => categoryMap[m.toLowerCase()]).filter(Boolean),
  };
}

// -- Diff --

const SKIP_DIFF_FIELDS = new Set(['logo', 'slug']);

export function diffModels(apiModels, webflowItems) {
  const wfBySlug = new Map();
  for (const item of webflowItems) {
    wfBySlug.set(item.fieldData.slug, item);
  }

  const toCreate = [];
  const toUpdate = [];
  let unchanged = 0;
  const apiSlugs = new Set();

  for (const model of apiModels) {
    apiSlugs.add(model.slug);
    const existing = wfBySlug.get(model.slug);

    if (!existing) {
      toCreate.push(model.fields);
      continue;
    }

    const hasChanges = Object.keys(model.fields).some((key) => {
      if (SKIP_DIFF_FIELDS.has(key)) return false;
      const apiVal = model.fields[key];
      const wfVal = existing.fieldData[key];
      if ((apiVal === '' || apiVal == null) && (wfVal === '' || wfVal == null)) return false;
      return JSON.stringify(apiVal) !== JSON.stringify(wfVal);
    });

    if (hasChanges) {
      toUpdate.push({ id: existing.id, fieldData: model.fields });
    } else {
      unchanged++;
    }
  }

  const toDelete = webflowItems
    .filter((item) => !apiSlugs.has(item.fieldData.slug))
    .map((item) => item.id);

  return { toCreate, toUpdate, toDelete, unchanged };
}

// -- Logo resolution --

const MIME_TO_EXT = {
  'image/png': '.png',
  'image/svg+xml': '.svg',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

async function resolveLogo(model) {
  const { logo_url, display_name, name } = model;

  if (!logo_url) return null;

  if (logo_url.startsWith('http')) {
    return { url: logo_url, alt: `${display_name || name} logo` };
  }

  if (logo_url.startsWith('data:')) {
    const match = logo_url.match(/^data:([^;]+);base64,(.+)$/s);
    if (!match) return null;

    const [, mime, payload] = match;
    const ext = MIME_TO_EXT[mime];
    if (!ext) return null;

    const buffer = Buffer.from(payload, 'base64');
    if (buffer.length === 0) return null;

    if (dryRun) {
      console.log(`[dry run] Would upload logo for: ${name}`);
      return { url: 'dry-run-placeholder', alt: `${display_name || name} logo` };
    }
    console.log(`Uploading logo for: ${name}`);
    const assetUrl = await wf.uploadAsset(WEBFLOW_SITE_ID, `${name}${ext}`, buffer);
    return { url: assetUrl, alt: `${display_name || name} logo` };
  }

  return null;
}

// -- Categories sync --

async function syncCategories(models, categoriesCollectionId) {
  const allModalities = new Set();
  for (const model of models) {
    if (model.modalities) {
      for (const m of model.modalities) allModalities.add(m);
    }
  }

  const existingItems = await wf.listCollectionItems(categoriesCollectionId);
  const existingBySlug = new Map();
  for (const item of existingItems) {
    existingBySlug.set(item.fieldData.slug, item.id);
  }

  const categoryMap = {};
  for (const modality of allModalities) {
    const slug = modality.toLowerCase();
    if (existingBySlug.has(slug)) {
      categoryMap[slug] = existingBySlug.get(slug);
    } else if (dryRun) {
      console.log(`[dry run] Would create category: ${modality}`);
      categoryMap[slug] = `dry-run-${slug}`;
    } else {
      console.log(`Creating category: ${modality}`);
      const result = await wf.createItems(categoriesCollectionId, [{ name: modality, slug }]);
      const newItem = result.items[0];
      categoryMap[slug] = newItem.id;
    }
  }

  return categoryMap;
}

// -- Main --

async function main() {
  if (dryRun) console.log('=== DRY RUN MODE — no changes will be pushed to Webflow ===\n');

  // Phase 1: Fetch
  console.log('Fetching models from Modular Cloud API...');
  const modelGarden = await fetchModelGarden();
  const models = modelGarden.items.map(transformModel);
  console.log(`Fetched ${models.length} models`);

  // Discover collections
  const collections = await wf.getCollections(WEBFLOW_SITE_ID);
  const categoriesCol = wf.findCollectionBySlug(collections, 'models-category');
  const modelsCol = wf.findCollectionBySlug(collections, 'models');

  // Sync categories
  console.log('Syncing categories...');
  const categoryMap = await syncCategories(models, categoriesCol.id);
  console.log(`Categories ready: ${Object.keys(categoryMap).join(', ')}`);

  // Resolve logos and build field data
  console.log('Resolving logos and building field data...');
  const apiModels = [];
  for (const model of models) {
    const logoField = await resolveLogo(model);
    const fields = toWebflowFields(model, model.modalities || [], categoryMap, logoField);
    apiModels.push({ slug: model.name, fields });
  }

  // Phase 2: Diff
  console.log('Fetching existing Webflow items...');
  const webflowItems = await wf.listCollectionItems(modelsCol.id);
  const { toCreate, toUpdate, toDelete, unchanged } = diffModels(apiModels, webflowItems);

  // Phase 3: Sync
  if (dryRun) {
    if (toCreate.length > 0) {
      console.log(`[dry run] Would create ${toCreate.length} models:`);
      for (const fields of toCreate) {
        console.log(`  ${fields.slug}`);
      }
    }
    if (toUpdate.length > 0) {
      console.log(`[dry run] Would update ${toUpdate.length} models:`);
      for (const item of toUpdate) {
        console.log(`  ${item.fieldData.slug}`);
      }
    }
    if (toDelete.length > 0) {
      console.log(`[dry run] Would delete ${toDelete.length} models`);
    }
    console.log(
      `\n[dry run] Summary — Create: ${toCreate.length}, Update: ${toUpdate.length}, Delete: ${toDelete.length}, Unchanged: ${unchanged}`
    );
    return;
  }

  if (toCreate.length > 0) {
    console.log(`Creating ${toCreate.length} models...`);
    for (const fields of toCreate) {
      console.log(`  Creating: ${fields.slug}`);
    }
    await wf.createItems(modelsCol.id, toCreate);
  }

  if (toUpdate.length > 0) {
    console.log(`Updating ${toUpdate.length} models...`);
    for (const item of toUpdate) {
      console.log(`  Updating: ${item.fieldData.slug}`);
    }
    await wf.updateItems(modelsCol.id, toUpdate);
  }

  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} models...`);
    await wf.deleteItems(modelsCol.id, toDelete);
  }

  // Summary
  console.log(
    `\nSync complete. Created: ${toCreate.length}, Updated: ${toUpdate.length}, Deleted: ${toDelete.length}, Unchanged: ${unchanged}`
  );
}

if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
