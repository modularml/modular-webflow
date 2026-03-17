import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { MODULAR_CLOUD_API_TOKEN, MODULAR_CLOUD_ORG, MODULAR_CLOUD_BASE_URL } = process.env;

if (!MODULAR_CLOUD_API_TOKEN || !MODULAR_CLOUD_ORG || !MODULAR_CLOUD_BASE_URL) {
  console.error('Missing required environment variables: MODULAR_CLOUD_API_TOKEN, MODULAR_CLOUD_ORG, MODULAR_CLOUD_BASE_URL');
  process.exit(1);
}

const API_DOMAIN = 'api.modular.com';
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

async function fetchEndpoint(gatewayUid) {
  const res = await fetch(`${MODULAR_CLOUD_BASE_URL}/api/v1/endpoints/${gatewayUid}`, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function toSubdomain(displayName) {
  return displayName
    .toLowerCase()
    .replace(/[\s._]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
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

function transformModel(model, endpointUrl) {
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
    endpoint_url: endpointUrl,
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
    let endpointUrl;

    if (model.gateway_uid) {
      try {
        const endpoint = await fetchEndpoint(model.gateway_uid);
        endpointUrl = endpoint.url;
      } catch (err) {
        console.error(`Failed to fetch endpoint for ${model.name}: ${err.message}`);
        endpointUrl = null;
      }
    } else {
      const subdomain = toSubdomain(model.display_name);
      endpointUrl = `https://${subdomain}.${API_DOMAIN}`;
    }

    const transformed = transformModel(model, endpointUrl);

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
