import { createHash } from 'node:crypto';

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function createClient(apiToken) {
  async function webflowFetch(path, options = {}) {
    const url = `https://api.webflow.com/v2${path}`;
    const method = options.method || 'GET';

    const response = await fetch(url, {
      ...options,
      method,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Webflow API error: ${method} ${path} => ${response.status} ${response.statusText}\n${body}`
      );
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // Detect whether /items/live endpoints are available (they 404 on
  // sites that have never been published). Cache the result per collection.
  const liveSupported = new Map();

  async function supportsLive(collectionId) {
    if (liveSupported.has(collectionId)) return liveSupported.get(collectionId);

    try {
      await webflowFetch(
        `/collections/${collectionId}/items/live?limit=1`
      );
      liveSupported.set(collectionId, true);
      return true;
    } catch (err) {
      if (err.message.includes('404')) {
        console.log('Live endpoints not available for this site, using staged + publish');
        liveSupported.set(collectionId, false);
        return false;
      }
      throw err;
    }
  }

  async function getCollections(siteId) {
    const data = await webflowFetch(`/sites/${siteId}/collections`);
    return data.collections;
  }

  function findCollectionBySlug(collections, slug) {
    const found = collections.find((c) => c.slug === slug);
    if (!found) {
      throw new Error(`Collection with slug "${slug}" not found`);
    }
    return found;
  }

  async function listCollectionItems(collectionId) {
    const limit = 100;
    let offset = 0;
    let allItems = [];

    while (true) {
      const data = await webflowFetch(
        `/collections/${collectionId}/items?limit=${limit}&offset=${offset}`
      );
      const items = data.items || [];
      allItems = allItems.concat(items);

      const total = data.pagination?.total ?? allItems.length;
      if (allItems.length >= total || items.length === 0) {
        break;
      }
      offset += limit;
    }

    return allItems;
  }

  async function publishItems(collectionId, itemIds) {
    const batches = chunk(itemIds, 100);
    for (const batch of batches) {
      await webflowFetch(`/collections/${collectionId}/items/publish`, {
        method: 'POST',
        body: JSON.stringify({ itemIds: batch }),
      });
    }
  }

  async function createItems(collectionId, fieldDataArray) {
    const live = await supportsLive(collectionId);
    const suffix = live ? '/live' : '';
    const batches = chunk(fieldDataArray, 100);
    const allCreated = [];

    for (const batch of batches) {
      const body = {
        items: batch.map((fieldData) => ({ fieldData })),
      };
      const data = await webflowFetch(`/collections/${collectionId}/items${suffix}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const created = data?.items || [];
      allCreated.push(...created);
    }

    if (!live && allCreated.length > 0) {
      await publishItems(collectionId, allCreated.map((item) => item.id));
    }

    return { items: allCreated };
  }

  async function updateItems(collectionId, itemsArray) {
    const live = await supportsLive(collectionId);
    const suffix = live ? '/live' : '';
    const batches = chunk(itemsArray, 100);
    const allUpdated = [];

    for (const batch of batches) {
      const data = await webflowFetch(`/collections/${collectionId}/items${suffix}`, {
        method: 'PATCH',
        body: JSON.stringify({ items: batch }),
      });
      const updated = data?.items || [];
      allUpdated.push(...updated);
    }

    if (!live && allUpdated.length > 0) {
      await publishItems(collectionId, allUpdated.map((item) => item.id));
    }

    return { items: allUpdated };
  }

  async function deleteItems(collectionId, itemIds) {
    const live = await supportsLive(collectionId);
    const suffix = live ? '/live' : '';
    const batches = chunk(itemIds, 100);

    for (const batch of batches) {
      await webflowFetch(`/collections/${collectionId}/items${suffix}`, {
        method: 'DELETE',
        body: JSON.stringify({ itemIds: batch }),
      });
    }
  }

  async function uploadAsset(siteId, fileName, fileBuffer) {
    const fileHash = createHash('md5').update(fileBuffer).digest('hex');

    const metadata = await webflowFetch(`/sites/${siteId}/assets`, {
      method: 'POST',
      body: JSON.stringify({ fileName, fileHash }),
    });

    const { uploadUrl, uploadDetails } = metadata;

    const formData = new FormData();
    for (const [key, value] of Object.entries(uploadDetails)) {
      formData.append(key, value);
    }
    formData.append('file', new Blob([fileBuffer]), fileName);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const body = await uploadResponse.text();
      throw new Error(
        `Asset upload failed: ${uploadResponse.status} ${uploadResponse.statusText}\n${body}`
      );
    }

    return metadata.hostedUrl || metadata.url || metadata.assetUrl;
  }

  return {
    webflowFetch,
    getCollections,
    findCollectionBySlug,
    listCollectionItems,
    createItems,
    updateItems,
    deleteItems,
    uploadAsset,
  };
}

export { createClient, chunk };
