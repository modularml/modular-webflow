import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { MODULAR_CLOUD_API_TOKEN, MODULAR_CLOUD_ORG, MODULAR_CLOUD_BASE_URL } = process.env;

if (!MODULAR_CLOUD_API_TOKEN || !MODULAR_CLOUD_ORG || !MODULAR_CLOUD_BASE_URL) {
  console.error('Missing required environment variables');
  process.exit(1);
}

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
  const data = await listRes.json();

  return data;
}

fetchModelGarden()
  .then((data) => {
    const outDir = join(__dirname, '..', 'data');
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'models.json'), JSON.stringify(data, null, 2));
    console.log(`Wrote ${outDir}/models.json`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
