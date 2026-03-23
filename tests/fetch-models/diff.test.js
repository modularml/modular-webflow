import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { diffModels } from '../../scripts/fetch-models.js';

function makeApiModel(slug, fields) {
  return { slug, fields: { slug, ...fields } };
}

function makeWfItem(id, slug, fieldData) {
  return { id, fieldData: { slug, ...fieldData } };
}

describe('diffModels', () => {
  it('identifies items to create when new in API but not in Webflow', () => {
    const apiModels = [makeApiModel('new-model', { name: 'New Model' })];
    const webflowItems = [];

    const result = diffModels(apiModels, webflowItems);

    assert.equal(result.toCreate.length, 1);
    assert.deepEqual(result.toCreate[0], { slug: 'new-model', name: 'New Model' });
    assert.equal(result.toUpdate.length, 0);
    assert.equal(result.toDelete.length, 0);
    assert.equal(result.unchanged, 0);
  });

  it('identifies items to delete when in Webflow but not in API', () => {
    const apiModels = [];
    const webflowItems = [makeWfItem('wf-id-1', 'old-model', { name: 'Old Model' })];

    const result = diffModels(apiModels, webflowItems);

    assert.equal(result.toDelete.length, 1);
    assert.equal(result.toDelete[0], 'wf-id-1');
    assert.equal(result.toCreate.length, 0);
    assert.equal(result.toUpdate.length, 0);
    assert.equal(result.unchanged, 0);
  });

  it('identifies items to update when fields differ', () => {
    const apiModels = [makeApiModel('existing-model', { name: 'Updated Name' })];
    const webflowItems = [makeWfItem('wf-id-2', 'existing-model', { name: 'Old Name' })];

    const result = diffModels(apiModels, webflowItems);

    assert.equal(result.toUpdate.length, 1);
    assert.equal(result.toUpdate[0].id, 'wf-id-2');
    assert.deepEqual(result.toUpdate[0].fieldData, { slug: 'existing-model', name: 'Updated Name' });
    assert.equal(result.toCreate.length, 0);
    assert.equal(result.toDelete.length, 0);
    assert.equal(result.unchanged, 0);
  });

  it('counts unchanged items when fields are identical', () => {
    const apiModels = [makeApiModel('same-model', { name: 'Same Name', provider: 'Acme' })];
    const webflowItems = [makeWfItem('wf-id-3', 'same-model', { name: 'Same Name', provider: 'Acme' })];

    const result = diffModels(apiModels, webflowItems);

    assert.equal(result.unchanged, 1);
    assert.equal(result.toCreate.length, 0);
    assert.equal(result.toUpdate.length, 0);
    assert.equal(result.toDelete.length, 0);
  });

  it('ignores logo-image field differences in comparison', () => {
    const apiModels = [
      makeApiModel('logo-model', {
        name: 'Logo Model',
        'logo-image': { fileId: 'new-file-id', url: 'https://cdn.example.com/new.png' },
      }),
    ];
    const webflowItems = [
      makeWfItem('wf-id-4', 'logo-model', {
        name: 'Logo Model',
        'logo-image': { fileId: 'old-file-id', url: 'https://cdn.example.com/old.png' },
      }),
    ];

    const result = diffModels(apiModels, webflowItems);

    assert.equal(result.unchanged, 1);
    assert.equal(result.toUpdate.length, 0);
  });
});
