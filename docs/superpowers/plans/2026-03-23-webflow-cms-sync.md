# Webflow CMS Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `models.json` file output in `fetch-models.js` with direct Webflow CMS sync via the Data API.

**Architecture:** The script becomes a three-phase pipeline: fetch from Modular Cloud API, diff against existing Webflow CMS state, then batch sync (create/update/delete). A separate `webflow-api.js` module handles all Webflow Data API calls. Logo images are either passed as URLs or uploaded via the Assets API.

**Tech Stack:** Node.js 20 (ES modules), Webflow Data API v2, `node:test` for unit tests, `node:crypto` for MD5 hashing.

**Spec:** `docs/superpowers/specs/2026-03-20-webflow-cms-sync-design.md`

**CRITICAL: NEVER target the production Webflow site (`68c9c3107effc2ea46e1a81f`). Only the test site (`696947140cab938ac6990602`).**

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `scripts/webflow-api.js` | Create | Webflow Data API client: collections, items CRUD, assets upload, publish |
| `scripts/fetch-models.js` | Rewrite | Orchestration: fetch API, transform, diff, sync categories, resolve logos, sync models |
| `.github/workflows/fetch-models.yml` | Modify | Add environment input, Webflow env vars, remove git commit step |
| `tests/fetch-models/diff.test.js` | Create | Unit tests for diff logic (pure functions) |
| `tests/fetch-models/transform.test.js` | Create | Unit tests for field mapping and transform |
| `data/models.json` | Delete | No longer needed |
| `data/images/` | Delete | No longer needed |

---

### Task 0: Schema Migration

One-time change to the test site CMS: convert the `logo` field from Link to Image type.

**Files:**
- No code files; this is a Webflow API operation

- [ ] **Step 1: Delete the existing `logo` Link field from the Models collection**

Use the Webflow MCP or Data API to delete the `logo` field (id: `c95daeedec88cf91cb55c7a5b182e2e4`) from collection `69bda3d2ff82137fe97f16d9`.

- [ ] **Step 2: Create a new `logo` Image field on the Models collection**

Create a static field with type `Image` and displayName `Logo` on collection `69bda3d2ff82137fe97f16d9`.

- [ ] **Step 3: Verify the field exists**

Fetch collection details for `69bda3d2ff82137fe97f16d9` and confirm a field with slug `logo` and type `ImageRef` (or `Image`) exists.

---

### Task 1: Webflow API Client

Build the low-level Webflow Data API wrapper. All Webflow HTTP calls go through this module.

**Files:**
- Create: `scripts/webflow-api.js`

- [ ] **Step 1: Create the module with base fetch helper**

```js
// scripts/webflow-api.js
const WEBFLOW_API_BASE = 'https://api.webflow.com/v2';

function createClient(apiToken) {
  async function webflowFetch(path, options = {}) {
    const url = `${WEBFLOW_API_BASE}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Webflow API ${options.method || 'GET'} ${path} failed (${res.status}): ${body}`);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  return { webflowFetch };
}

export { createClient };
```

- [ ] **Step 2: Add collection discovery**

```js
async function getCollections(siteId) {
  const data = await webflowFetch(`/sites/${siteId}/collections`);
  return data.collections;
}

function findCollectionBySlug(collections, slug) {
  const col = collections.find((c) => c.slug === slug);
  if (!col) throw new Error(`Collection with slug "${slug}" not found`);
  return col;
}
```

Add these inside `createClient` and export them on the returned object.

- [ ] **Step 3: Add list items with pagination**

```js
async function listCollectionItems(collectionId) {
  const items = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const data = await webflowFetch(
      `/collections/${collectionId}/items?limit=${limit}&offset=${offset}`
    );
    items.push(...data.items);
    if (items.length >= data.pagination.total) break;
    offset += limit;
  }
  return items;
}
```

- [ ] **Step 4: Add batch create, update, delete, and publish**

```js
async function createItems(collectionId, fieldDataArray) {
  return webflowFetch(`/collections/${collectionId}/items`, {
    method: 'POST',
    body: JSON.stringify({ fieldData: fieldDataArray }),
  });
}

async function updateItems(collectionId, itemsArray) {
  return webflowFetch(`/collections/${collectionId}/items`, {
    method: 'PATCH',
    body: JSON.stringify({ items: itemsArray }),
  });
}

async function deleteItems(collectionId, itemIds) {
  return webflowFetch(`/collections/${collectionId}/items`, {
    method: 'DELETE',
    body: JSON.stringify({ items: itemIds.map((id) => ({ id })) }),
  });
}

async function publishItems(collectionId, itemIds) {
  return webflowFetch(`/collections/${collectionId}/items/publish`, {
    method: 'POST',
    body: JSON.stringify({ itemIds }),
  });
}
```

- [ ] **Step 5: Add asset upload (two-step)**

```js
async function uploadAsset(siteId, fileName, fileBuffer) {
  const crypto = await import('node:crypto');
  const fileHash = crypto.createHash('md5').update(fileBuffer).digest('hex');

  // Step 1: Create asset metadata
  const metadata = await webflowFetch(`/sites/${siteId}/assets`, {
    method: 'POST',
    body: JSON.stringify({ fileName, fileHash }),
  });

  // Step 2: Upload to S3 presigned URL
  const form = new FormData();
  for (const [key, value] of Object.entries(metadata.uploadDetails)) {
    form.append(key, value);
  }
  form.append('file', new Blob([fileBuffer]), fileName);

  const uploadRes = await fetch(metadata.uploadUrl, {
    method: 'POST',
    body: form,
  });
  if (!uploadRes.ok) {
    throw new Error(`Asset upload to S3 failed (${uploadRes.status})`);
  }

  return metadata.assetUrl;
}
```

- [ ] **Step 6: Export all functions and commit**

Ensure `createClient` returns all functions: `getCollections`, `findCollectionBySlug`, `listCollectionItems`, `createItems`, `updateItems`, `deleteItems`, `publishItems`, `uploadAsset`.

```bash
git add scripts/webflow-api.js
git commit -m "feat: add Webflow Data API client module"
```

---

### Task 2: Transform and Diff Logic (with tests)

Build the pure functions for transforming API data to Webflow field format and diffing against existing items.

**Files:**
- Create: `tests/fetch-models/transform.test.js`
- Create: `tests/fetch-models/diff.test.js`
- Modify: `scripts/fetch-models.js` (add exported pure functions, keep existing code for now)

- [ ] **Step 1: Write failing tests for `toWebflowFields`**

```js
// tests/fetch-models/transform.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toWebflowFields } from '../../scripts/fetch-models.js';

describe('toWebflowFields', () => {
  it('maps all fields correctly', () => {
    const model = {
      display_name: 'DeepSeek V3',
      name: 'deepseek-v3',
      description: 'A great model.',
      model_id: 'deepseek-ai/DeepSeek-V3',
      provider: 'DeepSeek',
      context_window: '128K',
      total_params: '671B',
      active_params: '37B',
      precision: 'FP8',
      model_url: 'https://huggingface.co/deepseek-ai/DeepSeek-V3',
      isLive: true,
      isNew: false,
      isTrending: true,
    };
    const categoryMap = { llm: 'cat-id-1', vision: 'cat-id-2' };
    const modalities = ['LLM', 'Vision'];
    const logoField = { url: 'https://example.com/logo.png', alt: 'DeepSeek V3 logo' };

    const result = toWebflowFields(model, modalities, categoryMap, logoField);

    assert.equal(result.name, 'DeepSeek V3');
    assert.equal(result.slug, 'deepseek-v3');
    assert.equal(result['display-name'], 'DeepSeek V3');
    assert.equal(result['model-id'], 'deepseek-ai/DeepSeek-V3');
    assert.equal(result.description, '<p>A great model.</p>');
    assert.equal(result.provider, 'DeepSeek');
    assert.equal(result['context-window'], '128K');
    assert.equal(result['total-params'], '671B');
    assert.equal(result['active-params'], '37B');
    assert.equal(result.precision, 'FP8');
    assert.equal(result['model-url'], 'https://huggingface.co/deepseek-ai/DeepSeek-V3');
    assert.equal(result.live, true);
    assert.equal(result.new, false);
    assert.equal(result.trending, true);
    assert.deepEqual(result.categories, ['cat-id-1', 'cat-id-2']);
    assert.deepEqual(result.logo, logoField);
  });

  it('handles undefined optional fields', () => {
    const model = {
      display_name: 'Test',
      name: 'test',
      isLive: false,
      isNew: false,
      isTrending: false,
    };
    const result = toWebflowFields(model, [], {}, null);

    assert.equal(result.provider, '');
    assert.equal(result.description, '');
    assert.equal(result['model-url'], '');
    assert.equal(result.logo, null);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test tests/fetch-models/transform.test.js`
Expected: FAIL — `toWebflowFields` not found

- [ ] **Step 3: Write `toWebflowFields` in fetch-models.js**

Add at the top of `scripts/fetch-models.js` (keep existing code below for now):

```js
export function toWebflowFields(model, modalities, categoryMap, logoField) {
  return {
    name: model.display_name || model.name,
    slug: model.name,
    'display-name': model.display_name || '',
    'model-id': model.model_id || '',
    logo: logoField,
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test tests/fetch-models/transform.test.js`
Expected: PASS

- [ ] **Step 5: Write failing tests for `diffModels`**

```js
// tests/fetch-models/diff.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { diffModels } from '../../scripts/fetch-models.js';

describe('diffModels', () => {
  it('identifies items to create', () => {
    const apiModels = [{ slug: 'new-model', fields: { name: 'New' } }];
    const webflowItems = [];
    const { toCreate, toUpdate, toDelete } = diffModels(apiModels, webflowItems);

    assert.equal(toCreate.length, 1);
    assert.equal(toUpdate.length, 0);
    assert.equal(toDelete.length, 0);
  });

  it('identifies items to delete', () => {
    const apiModels = [];
    const webflowItems = [{ id: 'wf-1', fieldData: { slug: 'old-model', name: 'Old' } }];
    const { toCreate, toUpdate, toDelete } = diffModels(apiModels, webflowItems);

    assert.equal(toCreate.length, 0);
    assert.equal(toUpdate.length, 0);
    assert.equal(toDelete.length, 1);
    assert.equal(toDelete[0], 'wf-1');
  });

  it('identifies items to update when fields differ', () => {
    const apiModels = [{ slug: 'model-a', fields: { name: 'Model A', provider: 'New Co' } }];
    const webflowItems = [
      { id: 'wf-1', fieldData: { slug: 'model-a', name: 'Model A', provider: 'Old Co' } },
    ];
    const { toCreate, toUpdate, toDelete } = diffModels(apiModels, webflowItems);

    assert.equal(toCreate.length, 0);
    assert.equal(toUpdate.length, 1);
    assert.equal(toUpdate[0].id, 'wf-1');
    assert.equal(toDelete.length, 0);
  });

  it('skips unchanged items', () => {
    const fields = { name: 'Model A', provider: 'Same Co', live: true };
    const apiModels = [{ slug: 'model-a', fields }];
    const webflowItems = [{ id: 'wf-1', fieldData: { slug: 'model-a', ...fields } }];
    const { toCreate, toUpdate, toDelete, unchanged } = diffModels(apiModels, webflowItems);

    assert.equal(toCreate.length, 0);
    assert.equal(toUpdate.length, 0);
    assert.equal(toDelete.length, 0);
    assert.equal(unchanged, 1);
  });

  it('ignores logo field in comparison', () => {
    const apiModels = [
      { slug: 'model-a', fields: { name: 'A', logo: { url: 'new.png', alt: 'A logo' } } },
    ];
    const webflowItems = [
      {
        id: 'wf-1',
        fieldData: {
          slug: 'model-a',
          name: 'A',
          logo: { fileId: '123', url: 'https://cdn.webflow.com/old.png', alt: 'A logo' },
        },
      },
    ];
    const { toUpdate, unchanged } = diffModels(apiModels, webflowItems);

    assert.equal(toUpdate.length, 0);
    assert.equal(unchanged, 1);
  });
});
```

- [ ] **Step 6: Run tests to verify they fail**

Run: `node --test tests/fetch-models/diff.test.js`
Expected: FAIL — `diffModels` not found

- [ ] **Step 7: Write `diffModels`**

Add to `scripts/fetch-models.js`:

```js
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
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `node --test tests/fetch-models/diff.test.js`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add tests/fetch-models/ scripts/fetch-models.js
git commit -m "feat: add toWebflowFields and diffModels with tests"
```

---

### Task 3: Rewrite fetch-models.js Main Script

Replace the old orchestration with the new sync pipeline. Keep `fetchModelGarden` and `transformModel` (minus `pricing`), remove everything else.

**Files:**
- Rewrite: `scripts/fetch-models.js`

- [ ] **Step 1: Rewrite the full script**

```js
// scripts/fetch-models.js
import { createHash } from 'node:crypto';
import { createClient } from './webflow-api.js';

// -- Environment variables --

const { MODULAR_CLOUD_API_TOKEN, MODULAR_CLOUD_ORG, MODULAR_CLOUD_BASE_URL } = process.env;
const { WEBFLOW_API_TOKEN, WEBFLOW_SITE_ID } = process.env;

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

const modularHeaders = {
  'X-Yatai-Api-Token': MODULAR_CLOUD_API_TOKEN,
  'X-Yatai-Organization': MODULAR_CLOUD_ORG,
};

const wf = createClient(WEBFLOW_API_TOKEN);

// -- Modular Cloud API (unchanged) --

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
    } else {
      console.log(`Creating category: ${modality}`);
      const result = await wf.createItems(categoriesCollectionId, [
        { name: modality, slug },
      ]);
      const newItem = result.items[0];
      categoryMap[slug] = newItem.id;
      await wf.publishItems(categoriesCollectionId, [newItem.id]);
    }
  }

  return categoryMap;
}

// -- Main --

async function main() {
  // Phase 1: Fetch
  console.log('Fetching models from Modular Cloud API...');
  const modelGarden = await fetchModelGarden();
  const models = modelGarden.items.map(transformModel);
  console.log(`Fetched ${models.length} models`);

  // Discover collections
  const collections = await wf.getCollections(WEBFLOW_SITE_ID);
  const categoriesCol = wf.findCollectionBySlug(collections, 'models-categories');
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
  const publishIds = [];

  if (toCreate.length > 0) {
    console.log(`Creating ${toCreate.length} models...`);
    for (const fields of toCreate) {
      console.log(`  Creating: ${fields.slug}`);
    }
    const created = await wf.createItems(modelsCol.id, toCreate);
    publishIds.push(...created.items.map((item) => item.id));
  }

  if (toUpdate.length > 0) {
    console.log(`Updating ${toUpdate.length} models...`);
    for (const item of toUpdate) {
      console.log(`  Updating: ${item.fieldData.slug}`);
    }
    await wf.updateItems(modelsCol.id, toUpdate);
    publishIds.push(...toUpdate.map((item) => item.id));
  }

  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} models...`);
    await wf.deleteItems(modelsCol.id, toDelete);
  }

  if (publishIds.length > 0) {
    console.log(`Publishing ${publishIds.length} items...`);
    await wf.publishItems(modelsCol.id, publishIds);
  }

  // Summary
  console.log(
    `\nSync complete. Created: ${toCreate.length}, Updated: ${toUpdate.length}, Deleted: ${toDelete.length}, Unchanged: ${unchanged}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Verify tests still pass**

Run: `node --test tests/fetch-models/transform.test.js tests/fetch-models/diff.test.js`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add scripts/fetch-models.js
git commit -m "feat: rewrite fetch-models.js for Webflow CMS sync"
```

---

### Task 4: Update GitHub Actions Workflow

**Files:**
- Modify: `.github/workflows/fetch-models.yml`

- [ ] **Step 1: Rewrite the workflow**

```yaml
name: Fetch Model Garden

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        type: choice
        options:
          - test
          - production
        default: 'test'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Sync models to Webflow
        run: node scripts/fetch-models.js
        env:
          MODULAR_CLOUD_API_TOKEN: ${{ secrets.MODULAR_CLOUD_API_TOKEN }}
          MODULAR_CLOUD_ORG: ${{ vars.MODULAR_CLOUD_ORG }}
          MODULAR_CLOUD_BASE_URL: ${{ vars.MODULAR_CLOUD_BASE_URL }}
          WEBFLOW_API_TOKEN: ${{ inputs.environment == 'production' && secrets.WEBFLOW_API_TOKEN || secrets.TEST_WEBFLOW_API_TOKEN }}
          WEBFLOW_SITE_ID: ${{ inputs.environment == 'production' && vars.WEBFLOW_SITE_ID || vars.TEST_WEBFLOW_SITE_ID }}
```

Key changes:
- Removed `permissions: contents: write` (no longer writing to repo)
- Removed the `git commit` / `git push` step entirely
- Added `workflow_dispatch` inputs with environment choice
- Added conditional env var selection for test vs production
- Renamed job from `fetch` to `sync`

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/fetch-models.yml
git commit -m "feat: update workflow for Webflow CMS sync with environment selection"
```

---

### Task 5: Clean Up Old Files

Remove files and directories that are no longer needed.

**Files:**
- Delete: `data/models.json`
- Delete: `data/images/` (entire directory)

- [ ] **Step 1: Remove old data files**

```bash
rm data/models.json
rm -rf data/images/
```

- [ ] **Step 2: Verify nothing references the removed files**

Search the codebase for references to `models.json` or `data/images`:

```bash
grep -r "models.json" --include="*.js" --include="*.ts" --include="*.yml" .
grep -r "data/images" --include="*.js" --include="*.ts" --include="*.yml" .
```

Expected: No results (or only references in the spec/plan docs).

- [ ] **Step 3: Commit**

```bash
git add -A data/
git commit -m "chore: remove models.json and data/images (replaced by Webflow CMS)"
```

---

### Task 6: Integration Test Against Test Site

Run the script against the real Webflow test site to verify end-to-end functionality.

**Files:**
- No new files; uses existing script

- [ ] **Step 1: Run the schema migration (Task 0) if not done yet**

Ensure the `logo` field on the test site Models collection is type Image, not Link.

- [ ] **Step 2: Set environment variables locally**

```bash
export MODULAR_CLOUD_API_TOKEN="..."
export MODULAR_CLOUD_ORG="..."
export MODULAR_CLOUD_BASE_URL="..."
export WEBFLOW_API_TOKEN="..."  # Test site token
export WEBFLOW_SITE_ID="696947140cab938ac6990602"  # Test site only!
```

- [ ] **Step 3: Run the script**

```bash
node scripts/fetch-models.js
```

Expected output:
```
Fetching models from Modular Cloud API...
Fetched N models
Syncing categories...
Categories ready: llm, vision, audio, image
Resolving logos and building field data...
Fetching existing Webflow items...
Creating X models...
Updating Y models...
Deleting Z models...
Publishing N items...

Sync complete. Created: X, Updated: Y, Deleted: Z, Unchanged: W
```

- [ ] **Step 4: Verify in Webflow**

Check the test site CMS in the Webflow dashboard:
- Categories collection has the expected items
- Models collection has the expected items with all fields populated
- Logo images are displaying correctly
- MultiReference links between models and categories are correct

- [ ] **Step 5: Run the script again (idempotency check)**

```bash
node scripts/fetch-models.js
```

Expected: `Created: 0, Updated: 0, Deleted: 0, Unchanged: N` — second run should be a no-op.

- [ ] **Step 6: Commit any final fixes**

If any fixes were needed during integration testing, commit them:

```bash
git add scripts/
git commit -m "fix: address issues found during integration testing"
```
