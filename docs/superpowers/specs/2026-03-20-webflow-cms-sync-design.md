# Webflow CMS Sync Design

**Date:** 2026-03-20
**Status:** Draft
**Scope:** Replace `models.json` file output with direct Webflow CMS sync via Data API

## Summary

Modify `scripts/fetch-models.js` to sync model data from the Modular Cloud Model Garden API directly into Webflow CMS collections, replacing the current `models.json` + `data/images/` + jsDelivr pipeline. The Webflow CMS becomes the sole output of the script.

**Target site:** Test Site - Blog Integration (`696947140cab938ac6990602`). The production Modular site must never be touched by this script.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Output target | Webflow CMS only, no `models.json` | CMS is the source of truth |
| Auth | Webflow Data API token (env var) | No MCP dependency in CI |
| Category management | Hybrid -- reuse existing, auto-create new, never delete | New modalities appear organically |
| Model deletion | Delete from Webflow if absent from API | CMS mirrors API exactly |
| Matching key | `slug` (derived from `model.name`) | Stable, unique, Webflow-native lookup |
| Sync strategy | Single-pass batch diff | Minimizes API calls (~5 per run for ~35 models) |
| Image handling | Upload base64 to Webflow Assets API; pass URLs directly to Image field | Eliminates jsDelivr/git image pipeline |
| Error handling | Fail hard (exit 1) on any error, log summary | Clear signal in GitHub Actions |
| Site configurability | Workflow `environment` input selects test vs production config | Supports future production cutover |

## Architecture

### Three-Phase Pipeline

```
Modular Cloud API --fetch--> Transform --diff--> Webflow CMS
                                |
                          Resolve logos
                          (URL passthrough
                           or Asset API upload)
```

**Phase 1 -- Fetch:** Pull all models from Modular Cloud API (existing logic, unchanged).

**Phase 2 -- Diff:** Fetch all existing Webflow CMS items (categories + models), compare against API data, produce three lists: to-create, to-update, to-delete.

**Phase 3 -- Sync:** Execute batch create/update/delete against Webflow, then publish created and updated items.

### Environment Variables

| Variable | Type | Purpose |
|---|---|---|
| `MODULAR_CLOUD_API_TOKEN` | Secret | Existing -- Model Garden API auth |
| `MODULAR_CLOUD_ORG` | Var | Existing -- Model Garden org |
| `MODULAR_CLOUD_BASE_URL` | Var | Existing -- Model Garden endpoint |
| `WEBFLOW_API_TOKEN` | Secret | New -- Webflow Data API auth |
| `WEBFLOW_SITE_ID` | Var | New -- Target Webflow site ID |

Default secrets/vars in the workflow: `TEST_WEBFLOW_API_TOKEN` / `TEST_WEBFLOW_SITE_ID`.

### Webflow API Token Setup

Generate at [webflow.com/dashboard/account/integrations](https://webflow.com/dashboard/account/integrations) > "Generate API Token". Required permissions: CMS read/write, Assets read/write. Store as a GitHub Actions secret.

### Webflow Collection IDs

The script discovers collection IDs dynamically by fetching all collections for the site and matching by slug:

- **Categories collection slug:** `models-categories`
- **Models collection slug:** `models`

This avoids hardcoding IDs that differ between test and production sites.

## Data Flow

### Categories Sync (runs first)

1. Collect all unique modalities from API response (e.g., `["LLM", "Vision", "Audio", "Image"]`)
2. Fetch existing categories from Webflow: `GET /collections/{categories_collection_id}/items`
3. Match by slug (lowercase modality name, e.g., `"LLM"` -> `"llm"`, `"Vision"` -> `"vision"`)
4. Create any missing categories (never delete existing ones)
5. Build a `slug -> itemId` lookup map for use in model sync

Category slugs are derived by lowercasing the modality name. Current modalities are single words (`LLM`, `Vision`, `Audio`, `Image`). If a multi-word modality appears in the future (e.g., `Text-to-Image`), Webflow's auto-slug on create will handle hyphenation, and subsequent syncs will match by the Webflow-assigned slug.

### Logo Resolution

For each model's `logo_url`:

- **Regular URL** (starts with `http`): Pass directly to Image field as `{url: "...", alt: "{display_name} logo"}`
- **Base64 data URI** (starts with `data:`): Upload via Webflow Assets API (see below), use returned Webflow CDN URL in Image field
- **Null/empty**: Skip, no image

#### Webflow Assets API Upload (two-step process)

For base64 data URI logos:

1. Decode the data URI to get the MIME type and binary buffer
2. Compute the MD5 hash of the file buffer (required by Webflow)
3. **Create asset metadata:** `POST https://api.webflow.com/v2/sites/{site_id}/assets`
   ```json
   {
     "fileName": "{model_name}.{ext}",
     "fileHash": "{md5_hex_digest}"
   }
   ```
   Response includes `uploadUrl` and `uploadDetails` (S3 presigned URL + form fields)
4. **Upload to S3:** `POST` (multipart/form-data) to the `uploadUrl` with all fields from `uploadDetails` plus the file buffer as the `file` field
5. The asset is now hosted on Webflow's CDN. Use the URL from the asset metadata response in the Image field.

#### Image Diff Strategy

When comparing existing Webflow items for updates, **skip the `logo` Image field in the diff comparison**. Instead, always set the logo on create, and on update only re-upload if the source `logo_url` value has changed (compare the original `logo_url` string from the API against a stored value, not the Webflow CDN URL). For the initial implementation, always include the logo URL on updates -- Webflow will skip re-downloading if the source URL hasn't changed.

### Models Sync

1. Transform API models (existing `transformModel` logic, minus `pricing`)
2. Fetch all existing model items from Webflow: `GET /collections/{models_collection_id}/items` (paginate if >100 items)
3. Match by slug (derived from `model.name`)
4. Diff:
   - Not in Webflow -> add to **create** list
   - In Webflow but data differs -> add to **update** list
   - In Webflow and identical -> skip
5. Webflow items not in API response -> add to **delete** list
6. Execute batch create, batch update, batch delete (max 100 items per batch request; chunk if needed)
7. Publish all created and updated items (not deleted -- deletion removes them automatically)

### Slug Handling

Model slugs come from `model.name` in the API (e.g., `deepseek-v3-0324`, `flux2`, `glm-5`). These are already lowercase, hyphenated, alphanumeric strings that conform to Webflow's slug requirements. The script uses `model.name` directly as the Webflow slug without further normalization.

### Batch Size Limits

The Webflow v2 bulk CMS endpoints accept a maximum of **100 items per request**. With ~35 models currently, this fits in a single batch. If the model count grows beyond 100, the script must chunk operations into multiple batch requests.

### Field Mapping

| models.json field | Webflow CMS slug | CMS type | Transform |
|---|---|---|---|
| `name` | `slug` + `name` | built-in | Item name and slug |
| `display_name` | `display-name` | PlainText | Direct |
| `model_id` | `model-id` | PlainText | Direct |
| `logo_url` | `logo` | **Image** | URL or Asset API upload; alt = `"{display_name} logo"` |
| `description` | `description` | RichText | Wrap in `<p>` tags if present; skip if undefined |
| `provider` | `provider` | PlainText | Direct; may be undefined for some models |
| `modalities` | `categories` | MultiReference | Array of strings -> array of category item IDs via slug lookup |
| `context_window` | `context-window` | PlainText | Direct; may be undefined |
| `total_params` | `total-params` | PlainText | Direct; may be undefined |
| `active_params` | `active-params` | PlainText | Direct; may be undefined |
| `precision` | `precision` | PlainText | Direct; may be undefined |
| `model_url` | `model-url` | Link | Direct; may be undefined |
| `isLive` | `live` | Switch | Direct |
| `isNew` | `new` | Switch | Direct |
| `isTrending` | `trending` | Switch | Direct |
| `pricing` | -- | -- | Dropped, not synced |
| -- | `player-mp4` | Link | Not managed by script, manual only |

### Field Comparison for Updates

Compare all synced field values (except `logo` Image field) between the transformed API model and the existing Webflow item. If any field differs, include the item in the update batch. No partial updates -- send all fields on update. Undefined API values are treated as empty strings for comparison purposes.

## Schema Migration (One-Time)

Before the first sync run, change the `logo` field on the test site Models collection:

1. Delete the existing `logo` Link field
2. Create a new `logo` Image field

Existing test data will lose logo values; the sync will repopulate them.

## Error Handling

- Any Modular Cloud API or Webflow API failure causes `process.exit(1)`
- Each operation logs what it's doing: `Creating model: deepseek-r1`, `Uploading logo for: flux2`, etc.
- Summary logged at end: `Created: X, Updated: Y, Deleted: Z, Unchanged: W`
- GitHub Action shows as failed if any error occurs

## Workflow Changes (`fetch-models.yml`)

```yaml
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
```

The workflow uses the `environment` input to select which secrets/vars to use:

- **test** (default): `TEST_WEBFLOW_API_TOKEN` (secret), `TEST_WEBFLOW_SITE_ID` (var)
- **production**: `WEBFLOW_API_TOKEN` (secret), `WEBFLOW_SITE_ID` (var) -- to be configured later

The script receives `WEBFLOW_API_TOKEN` and `WEBFLOW_SITE_ID` as env vars regardless of which environment is selected; the workflow maps the appropriate secret/var names.

Other changes:
- Remove the `git add` / `git commit` / `git push` step for `data/models.json` and `data/images/`
- Keep the existing Modular Cloud env vars

## What Gets Removed

- `data/models.json` file write
- `data/images/` directory and all committed image files
- `JSDELIVR_BASE` constant
- `MIME_TO_EXT` constant
- `parseDataUri` function (replaced by simpler base64 detection + Asset API upload)
- `processModelGarden` image file I/O loop
- `fs` imports (`writeFileSync`, `mkdirSync`, `rmSync`)
- Git commit step in the GitHub Actions workflow

## What Gets Added

- Webflow Data API client (fetch-based, no external dependencies)
- Categories sync logic
- Models diff + batch sync logic
- Logo resolution with Asset API upload for base64 images
- Collection ID discovery (fetch collections by site ID, find by slug)

## Out of Scope

- Production site sync (explicitly excluded, test site only for now)
- `player-mp4` field management (manual via page template)
- `pricing` field (dropped from sync)
- Webflow Designer API usage (Data API only)
- Rate limit retry logic (expected call volume is well below limits with ~35 models)
- Dry-run mode (may be added later)
