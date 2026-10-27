# PRAVEQ Mentor — Journal Studio

Private Site: https://praveq-mentor-brand.gangbuzhou.chatgpt.site

Owner administration: `/admin`. The site's owner-only audience is unchanged. Publishing an article to the Journal never changes Site access.

## Writing and managing articles

1. Open `/admin` and sign into ChatGPT with the Site owner's account.
2. Click **新規記事**. Enter the title, MINDSET or THE JOURNEY, display date, excerpt and body. Choose **PRAVEQロゴ** for the single signature cover, or **写真をアップロード** to upload a JPEG, PNG or WebP and add a short photo description. Author is editable.
3. Use **プレビュー** to inspect the reader view. Toolbar buttons insert headings, bold text, lists, quotes and links. Blank lines separate paragraphs. Raw HTML is treated as text.
4. **下書きを保存** persists the article without adding it to the Journal. Drafts are available on other devices after sign-in.
5. **Journalに掲載** adds it to the Journal and creates its article URL. Listed articles are ordered by displayed date, then creation time, newest first.
6. Select an existing article to edit. **掲載内容を更新** updates a listed article; **掲載を取り下げる** returns it to draft.
7. Once listed, the article's URL stays fixed even if its title is edited. New drafts receive an automatic URL, editable under URL options before first listing.
8. **変更履歴** shows the latest 20 saved versions. Load one into the editor, inspect it, then save to restore its content. Loading alone changes no saved content.
9. **保管する** archives an article and removes it from the Journal. Open the 保管 filter and save it as a draft to recover it. There is no permanent delete action.
10. **保存済みの記事をバックアップ** downloads all saved article content, including drafts and archives, as JSON. Unsaved changes, revision history and image binaries are not included in this content export; image references are included. Keep the file for reference or later recovery; a bulk import UI is not implemented.

The editor warns before discarding unsaved changes. Save explicitly before leaving. A revision number prevents silently overwriting an edit saved in another window; copy unsaved text before reloading after a conflict.

## Canonical storage and initial import

The hosted D1 database is the canonical source for articles. Browser storage is not used as the durable store. Code deployments do not reset article data.

The original four Journal entries in `content/posts.mjs` are initial import data. The application imports them idempotently after schema migration and records the seed version. Future source changes do not overwrite existing DB content. Edit articles in `/admin` after import; changing `content/posts.mjs` does not update existing hosted articles.

Existing public-facing design, homepage text, original logo, founder photo, consultation booking link and legal-document links are preserved. The existing GitHub Pages website is not modified.

## Journal covers and photos

The old four artwork variants all render as the single deep-green PRAVEQ logo cover. Legacy records and revision snapshots remain readable; saving normalizes their visual choice to `logo`. No article body or URL is changed by the cover migration.

Photo uploads are stored durably in the Site's R2 `BUCKET`. The browser decodes JPEG/PNG/WebP (source up to 20MB/40MP), redraws at a maximum long edge of 2,400px and uploads JPEG; this removes EXIF/location metadata. The server limits uploads to 8MB, verifies raster signatures and restricts writes to the owner. SVG/external image URLs are not accepted. Both source and detail-page covers use centred cropping.

An upload changes the editor's selection; save the article to apply it. A replaced image remains available for revision restoration. Anonymous/non-owner image requests are served only while a published article actively uses that photo; draft, archived and unreferenced uploads remain owner-only. Image responses are private/no-store. JSON content backups contain references, not the R2 objects; copy the image store separately for a full restoration.

## Source structure

- `content/home.html`: homepage source; `app/route.ts` serves it and adds an owner-only management link in the footer.
- `content/admin.html`, `public/admin.mjs`, `public/admin.css`: management UI.
- `public/styles.css`, `public/app.js`, `public/article.js`: existing brand design and interactions.
- `public/journal-format.mjs`: shared, escaped article formatting and content validation.
- `app/api/admin/covers/route.ts`, `app/media/journal/[file]/route.ts`, `lib/journal-images.ts`: owner uploads and controlled photo delivery.
- `app/api/admin/posts/*`: authenticated owner operations and version history.
- `app/api/journal/route.ts`: listed articles only; drafts and archives are excluded.
- `app/journal/[slug]/route.ts`: dynamic article pages, returning 404 for unlisted articles.
- `lib/journal-store.ts`: authorization, safe initial import, D1 access, revision-guarded writes.
- `db/schema.ts`, `drizzle/`: schema and immutable migrations.
- `editorial/`: previously recorded source excerpts, voice guidelines and before/after copy mappings. These are source files, not deployed public assets.
- `.openai/hosting.json`: preserved Site ID, D1 and R2 bindings. No audience changes or credentials belong in this file.

## Authentication and configuration

Sites owns sign-in and supplies verified identity headers. Admin APIs require authenticated identity and a server-side match to `JOURNAL_OWNER_EMAIL`; the stable Site user ID is recorded with revisions. Private Site access is a separate outer boundary. Admin endpoints reject missing or non-owner identity and cross-origin browser writes. Do not weaken these checks if Site access changes later.

Set the owner email through native Sites environment configuration, not in browser code or the source manifest. Local `.dev.vars` is ignored. Managed preview has no mock login. Production authentication is not bypassed for tests.

## Build and verification

Use the Sites skill for installation, managed preview, builds, source synchronization, migrations and owner-private deployment. Local and hosted D1 stores are separate.

- `npm run check`: shared input validation, safe rendering, formatting and metadata tests.
- `npm run test:api`: isolated Miniflare/D1/R2 integration test using the actual production API handlers. Covers owner auth, cross-origin rejection, initial import, draft isolation, listing/unlisting, immutable listed URLs, revision conflicts, history, photo upload limits/access, recovery and image restoration. It never modifies a hosted Site.
- `npx tsc --noEmit --incremental false`: type checks.
- Build through the Sites build helper. Apply generated SQL to the local preview DB using the starter's documented local migration command; hosted deployment applies the tracked migrations.

The source was migrated from a static build to Vinext while preserving the same Site, audience and existing article URLs. Generated `dist/` is no longer tracked.
