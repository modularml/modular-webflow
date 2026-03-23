import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isMain = process.argv[1] === __filename;

const { MODULAR_CLOUD_API_TOKEN, MODULAR_CLOUD_ORG, MODULAR_CLOUD_BASE_URL } = process.env;

if (isMain && (!MODULAR_CLOUD_API_TOKEN || !MODULAR_CLOUD_ORG || !MODULAR_CLOUD_BASE_URL)) {
  console.error('Missing required environment variables: MODULAR_CLOUD_API_TOKEN, MODULAR_CLOUD_ORG, MODULAR_CLOUD_BASE_URL');
  process.exit(1);
}

const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh/modularml/modular-webflow@master/data/images';

const headers = {
  'X-Yatai-Api-Token': MODULAR_CLOUD_API_TOKEN,
  'X-Yatai-Organization': MODULAR_CLOUD_ORG,
};

async function fetchModelGarden() {
  const countRes = await fetch(`${MODULAR_CLOUD_BASE_URL}/api/v1/model_garden`, { headers });
  if (!countRes.ok) throw new Error(`Count request failed: ${countRes.status}`);
  const { total } = await countRes.json();

  const listRes = await fetch(`${MODULAR_CLOUD_BASE_URL}/api/v1/model_garden?count=${total}`, {
    headers,
  });
  if (!listRes.ok) throw new Error(`List request failed: ${listRes.status}`);
  return listRes.json();
}

const MIME_TO_EXT = {
  'image/png': '.png',
  'image/svg+xml': '.svg',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

function parseDataUri(dataUri) {
  if (!dataUri || !dataUri.startsWith('data:')) return null;

  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;

  const [, mime, payload] = match;
  const ext = MIME_TO_EXT[mime];
  if (!ext) return null;

  const buffer = Buffer.from(payload, 'base64');
  if (buffer.length === 0) return null;

  return { mime, ext, buffer };
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
    pricing: model.pricing,
    isLive: Boolean(model.gateway_id),
    isNew: tags.includes('New'),
    isTrending: tags.includes('Trending'),
  };
}

async function processModelGarden(modelGarden) {
  const results = [];
  const imagesDir = join(__dirname, '..', 'data', 'images');
  rmSync(imagesDir, { recursive: true, force: true });
  mkdirSync(imagesDir, { recursive: true });

  for (const model of modelGarden.items) {
    const transformed = transformModel(model);

    const parsed = parseDataUri(transformed.logo_url);
    if (parsed) {
      try {
        const filename = `${transformed.name}${parsed.ext}`;
        writeFileSync(join(imagesDir, filename), parsed.buffer);
        transformed.logo_url = `${JSDELIVR_BASE}/${filename}`;
        console.log(`Saved image for ${transformed.name}: ${filename}`);
      } catch (err) {
        console.error(`Failed to save image for ${transformed.name}: ${err.message}`);
        transformed.logo_url = null;
      }
    }

    results.push(transformed);
  }

  return results;
}

if (isMain) {
  fetchModelGarden()
    .then((data) => processModelGarden(data))
    .then((models) => {
      const outDir = join(__dirname, '..', 'data');
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, 'models.json'), JSON.stringify(models, null, 2));
      console.log(`Wrote ${models.length} models to ${outDir}/models.json`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export function toWebflowFields(model, modalities, categoryMap, logoField) {
  return {
    name: model.display_name || model.name,
    slug: model.name,
    'display-name': model.display_name || '',
    'model-id': model.model_id || '',
    'logo-image': logoField,
    description: model.description ? `<p>${model.description}</p>` : '',
    provider: model.provider || '',
    'context-window': model.context_window || '',
    'total-params': model.total_params || '',
    'active-params': model.active_params || '',
    precision: model.precision || '',
    'model-url': model.model_url || '',
    live: model.isLive,
    new: model.isNew,
    trending: model.isTrending,
    categories: modalities.map((m) => categoryMap[m.toLowerCase()]).filter(Boolean),
  };
}

const SKIP_DIFF_FIELDS = new Set(['logo-image', 'slug']);

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
