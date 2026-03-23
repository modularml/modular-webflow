import { fileURLToPath } from 'url';
import { createClient } from './webflow-api.js';

const __filename = fileURLToPath(import.meta.url);
const isMain = process.argv[1] === __filename;

// -- Configuration --

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

function normalizeApiModel(model) {
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
    isLive: Boolean(model.gateway_id) || tags.includes('Live'),
    isNew: tags.includes('New'),
    isTrending: tags.includes('Trending'),
  };
}

// -- Webflow field mapping --

export function buildWebflowFields(model, modalities, categoryMap, logoField) {
  return {
    name: model.name,
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

// Logo is resolved separately (upload vs URL); slug is identity, not content
const FIELDS_MANAGED_OUTSIDE_DIFF = new Set(['logo', 'slug']);

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

    const changedFields = [];
    for (const key of Object.keys(model.fields)) {
      if (FIELDS_MANAGED_OUTSIDE_DIFF.has(key)) continue;
      const apiVal = model.fields[key];
      const wfVal = existing.fieldData[key];
      if ((apiVal === '' || apiVal == null) && (wfVal === '' || wfVal == null)) continue;
      if (JSON.stringify(apiVal) !== JSON.stringify(wfVal)) {
        changedFields.push({ field: key, from: wfVal, to: apiVal });
      }
    }

    if (changedFields.length > 0) {
      toUpdate.push({ id: existing.id, fieldData: model.fields, changedFields });
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

function isUrl(str) {
  return str.startsWith('http');
}

function isBase64DataUri(str) {
  return str.startsWith('data:');
}

function buildLogoField(model) {
  return { url: model.logo_url, alt: `${model.display_name || model.name} logo` };
}

function parseBase64DataUri(dataUri) {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;

  const [, mime, payload] = match;
  const ext = MIME_TO_EXT[mime];
  if (!ext) return null;

  const buffer = Buffer.from(payload, 'base64');
  if (buffer.length === 0) return null;

  return { ext, buffer };
}

async function uploadBase64Logo(model) {
  const parsed = parseBase64DataUri(model.logo_url);
  if (!parsed) return null;

  console.log(`Uploading logo for: ${model.name}`);
  const assetUrl = await wf.uploadAsset(WEBFLOW_SITE_ID, `${model.name}${parsed.ext}`, parsed.buffer);
  return { url: assetUrl, alt: `${model.display_name || model.name} logo` };
}

async function resolveLogo(model) {
  const { logo_url } = model;
  if (!logo_url) return null;
  if (isUrl(logo_url)) return buildLogoField(model);
  if (isBase64DataUri(logo_url)) return uploadBase64Logo(model);
  return null;
}

// -- Orchestration helpers --

async function fetchModels() {
  console.log('Fetching models from Modular Cloud API...');
  const modelGarden = await fetchModelGarden();
  const allModels = modelGarden.items;
  const publicModels = allModels.filter((m) => !m.is_private);
  const models = publicModels.map(normalizeApiModel);
  console.log(`Fetched ${allModels.length} models (${allModels.length - publicModels.length} private, ${publicModels.length} public)`);
  return models;
}

async function discoverCollections() {
  const collections = await wf.getCollections(WEBFLOW_SITE_ID);
  return {
    categoriesCol: wf.findCollectionBySlug(collections, 'models-category'),
    modelsCol: wf.findCollectionBySlug(collections, 'models'),
  };
}

function collectUniqueModalities(models) {
  const all = new Set();
  for (const model of models) {
    if (model.modalities) {
      for (const m of model.modalities) all.add(m);
    }
  }
  return all;
}

function buildExistingCategoryMap(items) {
  const map = new Map();
  for (const item of items) {
    map.set(item.fieldData.slug, item.id);
  }
  return map;
}

async function syncCategories(models, categoriesCollectionId) {
  console.log('Syncing categories...');

  const needed = collectUniqueModalities(models);
  const existingItems = await wf.listCollectionItems(categoriesCollectionId);
  const existingBySlug = buildExistingCategoryMap(existingItems);

  const categoryMap = {};
  for (const modality of needed) {
    const slug = modality.toLowerCase();
    if (existingBySlug.has(slug)) {
      categoryMap[slug] = existingBySlug.get(slug);
    } else if (dryRun) {
      console.log(`[dry run] Would create category: ${modality}`);
      categoryMap[slug] = `dry-run-${slug}`;
    } else {
      console.log(`Creating category: ${modality}`);
      const result = await wf.createItems(categoriesCollectionId, [{ name: modality, slug }]);
      categoryMap[slug] = result.items[0].id;
    }
  }

  console.log(`Categories ready: ${Object.keys(categoryMap).join(', ')}`);
  return categoryMap;
}

async function fetchExistingItems(collectionId) {
  console.log('Fetching existing Webflow items...');
  return wf.listCollectionItems(collectionId);
}

function indexBySlug(items) {
  const map = new Map();
  for (const item of items) {
    map.set(item.fieldData.slug, item);
  }
  return map;
}

async function buildModelFieldData(models, categoryMap, existingItems) {
  console.log('Resolving logos and building field data...');
  const existingBySlug = indexBySlug(existingItems);
  const apiModels = [];

  for (const model of models) {
    const existing = existingBySlug.get(model.name);
    const existingLogo = existing?.fieldData?.logo;
    const hasBase64Logo = model.logo_url && isBase64DataUri(model.logo_url);

    // Reuse existing logo for base64 sources (avoid re-upload every run)
    let logoField;
    if (hasBase64Logo && existingLogo) {
      logoField = existingLogo;
    } else if (dryRun && hasBase64Logo) {
      console.log(`[dry run] Would upload logo for: ${model.name}`);
      logoField = { url: 'dry-run-placeholder', alt: `${model.display_name || model.name} logo` };
    } else {
      logoField = await resolveLogo(model);
    }

    const fields = buildWebflowFields(model, model.modalities || [], categoryMap, logoField);
    apiModels.push({ slug: model.name, fields });
  }

  return apiModels;
}

function truncate(val, maxLen = 80) {
  const str = typeof val === 'string' ? val : JSON.stringify(val);
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
}

function logChangedFields(changedFields) {
  for (const { field, from, to } of changedFields) {
    console.log(`    ${field}: ${truncate(from)} → ${truncate(to)}`);
  }
}

async function applyChanges(collectionId, { toCreate, toUpdate, toDelete }) {
  if (toCreate.length > 0) {
    console.log(`Creating ${toCreate.length} models...`);
    for (const fields of toCreate) console.log(`  Creating: ${fields.slug}`);
    await wf.createItems(collectionId, toCreate);
  }

  if (toUpdate.length > 0) {
    console.log(`Updating ${toUpdate.length} models...`);
    for (const item of toUpdate) {
      console.log(`  Updating: ${item.fieldData.slug}`);
      logChangedFields(item.changedFields);
    }
    await wf.updateItems(collectionId, toUpdate);
  }

  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} models...`);
    await wf.deleteItems(collectionId, toDelete);
  }
}

function logDryRunSummary({ toCreate, toUpdate, toDelete, unchanged }) {
  if (toCreate.length > 0) {
    console.log(`[dry run] Would create ${toCreate.length} models:`);
    for (const fields of toCreate) console.log(`  ${fields.slug}`);
  }
  if (toUpdate.length > 0) {
    console.log(`[dry run] Would update ${toUpdate.length} models:`);
    for (const item of toUpdate) {
      console.log(`  ${item.fieldData.slug}`);
      logChangedFields(item.changedFields);
    }
  }
  if (toDelete.length > 0) {
    console.log(`[dry run] Would delete ${toDelete.length} models`);
  }
  console.log(
    `\n[dry run] Summary — Create: ${toCreate.length}, Update: ${toUpdate.length}, Delete: ${toDelete.length}, Unchanged: ${unchanged}`
  );
}

function logSyncSummary({ toCreate, toUpdate, toDelete, unchanged }) {
  console.log(
    `\nSync complete. Created: ${toCreate.length}, Updated: ${toUpdate.length}, Deleted: ${toDelete.length}, Unchanged: ${unchanged}`
  );
}

// -- Main --

async function main() {
  if (dryRun) console.log('=== DRY RUN MODE — no changes will be pushed to Webflow ===\n');

  const models = await fetchModels();
  const { categoriesCol, modelsCol } = await discoverCollections();
  const categoryMap = await syncCategories(models, categoriesCol.id);
  const existingItems = await fetchExistingItems(modelsCol.id);
  const apiModels = await buildModelFieldData(models, categoryMap, existingItems);
  const changes = diffModels(apiModels, existingItems);

  if (dryRun) {
    logDryRunSummary(changes);
  } else {
    await applyChanges(modelsCol.id, changes);
    logSyncSummary(changes);
  }
}

if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
