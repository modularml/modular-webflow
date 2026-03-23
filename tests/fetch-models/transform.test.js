import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildWebflowFields } from '../../scripts/fetch-models.js';

describe('buildWebflowFields', () => {
  it('maps all fields correctly for a full model', () => {
    const model = {
      display_name: 'My Model',
      name: 'my-model',
      model_id: 'org/my-model',
      description: 'A great model',
      provider: 'Acme',
      context_window: 8192,
      total_params: '70B',
      active_params: '7B',
      precision: 'fp16',
      model_url: 'https://example.com/model',
      isLive: true,
      isNew: false,
      isTrending: true,
    };
    const modalities = ['Text', 'Image'];
    const categoryMap = { text: 'id-text', image: 'id-image' };
    const logoField = { fileId: 'abc', url: 'https://cdn.example.com/logo.png' };

    const result = buildWebflowFields(model, modalities, categoryMap, logoField);

    assert.equal(result.name, 'My Model');
    assert.equal(result.slug, 'my-model');
    assert.equal(result['display-name'], 'My Model');
    assert.equal(result['model-id'], 'org/my-model');
    assert.deepEqual(result.logo, logoField);
    assert.equal(result.description, 'A great model');
    assert.equal(result.provider, 'Acme');
    assert.equal(result['context-window'], 8192);
    assert.equal(result['total-params'], '70B');
    assert.equal(result['active-params'], '7B');
    assert.equal(result.precision, 'fp16');
    assert.equal(result['model-url'], 'https://example.com/model');
    assert.equal(result.live, true);
    assert.equal(result.new, false);
    assert.equal(result.trending, true);
    assert.deepEqual(result.modalities, ['id-text', 'id-image']);
  });

  it('handles undefined optional fields with empty string defaults', () => {
    const model = {
      display_name: 'Minimal Model',
      name: 'minimal-model',
      isLive: false,
      isNew: false,
      isTrending: false,
    };
    const result = buildWebflowFields(model, [], {}, null);

    assert.equal(result['model-id'], '');
    assert.equal(result.description, '');
    assert.equal(result.provider, '');
    assert.equal(result['context-window'], '');
    assert.equal(result['total-params'], '');
    assert.equal(result['active-params'], '');
    assert.equal(result.precision, '');
    assert.equal(result['model-url'], '');
    assert.deepEqual(result.modalities, []);
  });

  it('falls back to name when display_name is falsy', () => {
    const model = {
      display_name: '',
      name: 'fallback-model',
      isLive: false,
      isNew: false,
      isTrending: false,
    };
    const result = buildWebflowFields(model, [], {}, null);

    assert.equal(result.name, 'fallback-model');
    assert.equal(result['display-name'], '');
  });

  it('drops unknown modalities not in categoryMap', () => {
    const model = {
      display_name: 'Multi Model',
      name: 'multi-model',
      isLive: false,
      isNew: false,
      isTrending: false,
    };
    const modalities = ['Text', 'Video', 'Audio'];
    const categoryMap = { text: 'id-text', audio: 'id-audio' };

    const result = buildWebflowFields(model, modalities, categoryMap, null);

    assert.deepEqual(result.modalities, ['id-text', 'id-audio']);
  });
});
