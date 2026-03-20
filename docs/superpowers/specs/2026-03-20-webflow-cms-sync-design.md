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
| Category management | Hybrid — reuse existing, auto-create new, never delete | New modalities appear organically |
| Model deletion | Delete from Webflow if absent from API | CMS mirrors API exactly |
| Matching key | `slug` (derived from `model.name`) | Stable, unique, Webflow-native lookup |
| Sync strategy | Single-pass batch diff | Minimizes API calls (~5 per run for ~35 models) |
| Image handling | Upload base64 to Webflow Assets API; pass URLs directly to Image field | Eliminates jsDelivr/git image pipeline |
| Error handling | Fail hard (exit 1) on any error, log summary | Clear signal in GitHub Actions |
| Site configurability | Workflow inputs select which token/site pair to use | Supports future production cutover |

## Architecture

### Three-Phase Pipeline

```
Modular Cloud API ──fetch──> Transform ──diff──> Webflow CMS
                                │
                          Resolve logos
                          (URL passthrough
                           or Asset API upload)
```

**Phase 1 — Fetch:** Pull all models from Modular Cloud API (existing logic, unchanged).

**Phase 2 — Diff:** Fetch all existing Webflow CMS items (categories + models), compare against API data, produce three lists: to-create, to-update, to-delete.

**Phase 3 — Sync:** Execute batch create/update/delete against Webflow, then publish all changed items.

### Environment Variables

| Variable | Type | Purpose |
|---|---|---|
| `MODULAR_CLOUD_API_TOKEN` | Secret | Existing — Model Garden API auth |
| `MODULAR_CLOUD_ORG` | Secret | Existing — Model Garden org |
| `MODULAR_CLOUD_BASE_URL` | Var | Existing — Model Garden endpoint |
| `WEBFLOW_API_TOKEN` | Secret | New — Webflow Data API auth |
| `WEBFLOW_SITE_ID` | Var | New — Target Webflow site ID |

Default secrets/vars in the workflow: `TEST_WEBFLOW_API_TOKEN` / `TEST_WEBFLOW_SITE_ID`.

### Webflow API Token Setup

Generate at [webflow.com/dashboard/account/integrations](https://webflow.com/dashboard/account/integrations) > "Generate API Token". Required permissions: CMS read/write, Assets read/write. Store as a GitHub Actions secret.

## Data Flow

### Categories Sync (runs first)

1. Collect all unique modalities from API response (e.g., `["LLM", "Vision", "Audio", "Image"]`)
2. Fetch existing categories from Webflow: `GET /collections/{categories_collection_id}/items`
3. Match by slug (lowercase modality name)
4. Create any missing categories (never delete existing ones)
5. Build a `slug -> itemId` lookup map for use in model sync

### Logo Resolution

For each model's `logo_url`:

- **Regular URL** (starts with `http`): Pass directly to Image field as `{url: "...", alt: "{display_name} logo"}`
- **Base64 data URI** (starts with `data:`): Decode to buffer, upload via Webflow Assets API (`POST /sites/{site_id}/assets` to create metadata + presigned URL, then upload buffer), use returned Webflow CDN URL in Image field
- **Null/empty**: Skip, no image

### Models Sync

1. Transform API models (existing `transformModel` logic, minus `pricing`)
2. Fetch all existing model items from Webflow: `GET /collections/{models_collection_id}/items`
3. Match by slug (derived from `model.name`)
4. Diff:
   - Not in Webflow -> add to **create** list
   - In Webflow but data differs -> add to **update** list
   - In Webflow and identical -> skip
5. Webflow items not in API response -> add to **delete** list
6. Execute batch create, batch update, batch delete
7. Publish all affected items

### Field Mapping

| models.json field | Webflow CMS slug | CMS type | Transform |
|---|---|---|---|
| `name` | `slug` + `name` | built-in | Item name and slug |
| `display_name` | `display-name` | PlainText | Direct |
| `model_id` | `model-id` | PlainText | Direct |
| `logo_url` | `logo` | **Image** | URL or Asset API upload; alt = `"{display_name} logo"` |
| `description` | `description` | RichText | Wrap in `<p>` tags |
| `provider` | `provider` | PlainText | Direct |
| `modalities` | `categories` | MultiReference | Array of strings -> array of category item IDs via slug lookup |
| `context_window` | `context-window` | PlainText | Direct |
| `total_params` | `total-params` | PlainText | Direct |
| `active_params` | `active-params` | PlainText | Direct |
| `precision` | `precision` | PlainText | Direct |
| `model_url` | `model-url` | Link | Direct |
| `isLive` | `live` | Switch | Direct |
| `isNew` | `new` | Switch | Direct |
| `isTrending` | `trending` | Switch | Direct |
| `pricing` | — | — | Dropped, not synced |
| — | `player-mp4` | Link | Not managed by script, manual only |

### Field Comparison for Updates

Compare all synced field values between the transformed API model and the existing Webflow item. If any field differs, include the item in the update batch. No partial updates — send all fields on update.

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
      webflow_token_secret:
        description: 'Name of the secret containing the Webflow API token'
        default: 'TEST_WEBFLOW_API_TOKEN'
      webflow_site_id_var:
        description: 'Name of the variable containing the Webflow site ID'
        default: 'TEST_WEBFLOW_SITE_ID'
```

- Pass `WEBFLOW_API_TOKEN` and `WEBFLOW_SITE_ID` as env vars to the script
- Remove the `git add` / `git commit` step for `data/models.json` and `data/images/`
- Keep the existing Modular Cloud env vars

## What Gets Removed

- `data/models.json` file write
- `data/images/` directory and all committed image files
- `JSDELIVR_BASE` constant
- `parseDataUri` function (replaced by simpler base64 detection + Asset API upload)
- `processModelGarden` image file I/O loop
- Git commit step in the GitHub Actions workflow

## What Gets Added

- Webflow Data API client (fetch-based, no external dependencies)
- Categories sync logic
- Models diff + batch sync logic
- Logo resolution with Asset API upload for base64 images
- Collection ID discovery (fetch collections by site ID, find by slug)

## Out of Scope

- Production site sync (explicitly excluded, test site only)
- `player-mp4` field management (manual via page template)
- `pricing` field (dropped from sync)
- Webflow Designer API usage (Data API only)
