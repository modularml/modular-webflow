import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { MODULAR_CLOUD_API_TOKEN, MODULAR_CLOUD_ORG, MODULAR_CLOUD_BASE_URL } = process.env;

if (!MODULAR_CLOUD_API_TOKEN || !MODULAR_CLOUD_ORG || !MODULAR_CLOUD_BASE_URL) {
  console.error('Missing required environment variables: MODULAR_CLOUD_API_TOKEN, MODULAR_CLOUD_ORG, MODULAR_CLOUD_BASE_URL');
  process.exit(1);
}

const API_DOMAIN = 'api.modular.com';

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

    results.push(transformModel(model, endpointUrl));
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
