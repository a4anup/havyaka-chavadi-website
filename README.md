# Havyaka Chavadi — Bilingual Promotional Website

A complete static landing page using the supplied Havyaka Chavadi artwork in `assets/`.

## Start in VS Code

1. Open this folder in VS Code.
2. In a terminal, run `python3 -m http.server 8080` (or `npx serve .`).
3. Open http://localhost:8080.

**Do not double-click index.html**: browser restrictions prevent `fetch()` from loading the translation JSON over `file://`.

No npm install, build system, API keys, or backend is needed.

## Coming-soon mode (current)

Until the app launches, havyakachavadi.in shows a bilingual coming-soon page:

- `index.html`: the coming-soon page (animated logo, contact email, EN/ಕನ್ನಡ and light/dark/auto toggles).
- `css/coming-soon.css`, `js/coming-soon.js`: its styles and script. Text comes from the `soon*` keys in `config/locales.json`.
- `css/festive.css`, `js/festive.js`: festive effects shared by both pages and kept after launch: carved doors that open over the main logo, mango-leaf toran, diya sparks, drawn mandala, faint chavadi background (`assets/havyaka_splash_bg_720.jpg`, a small copy of the splash art), 3D logo tilt and the copy-email button.
- `site.html`: the full website, waiting for launch. Preview it locally at http://localhost:8080/site.html. It has a `noindex` tag so search engines skip it before launch.

### Launch day

```sh
sh scripts/launch.sh   # deletes the coming-soon page, makes site.html the new index.html, removes noindex, commits
git push               # GitHub Pages publishes it to havyakachavadi.in within a minute or two
```

Before launching, put the real store links in `config/app-links.json`.

## Edit

- `site.html` (becomes `index.html` at launch): sections, content layout and SEO structure.
- `css/styles.css`: all shared design tokens, responsive styles, dark theme.
- `js/main.js`: language switcher, theme switcher, mobile menu.
- `config/locales.json`: **single source of truth for all English and Kannada UI text**. Both locales have identical keys.
- `assets/`: supplied artwork (spelling-corrected versions). `havyaka_main_logo.png` (coming-soon logo), `havyaka_chavadi_light.png` / `havyaka_chavadi_dark.png` (hero logo per theme), `havyaka_splash.png` (About section and launch phone), `havyaka_app_icon_1024.png` (browser icon). `havyaka_splash_bg_720.jpg` is a small copy of the splash used as the faint background; regenerate it if the splash changes:
  `sips -s format jpeg -s formatOptions 72 --resampleWidth 720 assets/havyaka_splash.png --out assets/havyaka_splash_bg_720.jpg`
- The pages load small web copies, not the ~2 MB PNG originals (which stay as the masters). If an original changes, regenerate its copy:
  `cwebp -q 86 -resize 720 0 assets/havyaka_main_logo.png -o assets/havyaka_main_logo_720.webp`
  `cwebp -q 84 -resize 1200 0 assets/havyaka_chavadi_light.png -o assets/havyaka_chavadi_light_1200.webp` (same for `_dark`)
  `cwebp -q 82 assets/havyaka_splash.png -o assets/havyaka_splash.webp`
  `cwebp -q 86 -resize 512 512 assets/havyaka_app_icon_1024.png -o assets/havyaka_app_icon_512.webp` and `sips -s format png -Z 192 assets/havyaka_app_icon_1024.png --out assets/havyaka_app_icon_192.png` (browser icon)

## Deploy

Upload the contents to any static host (Cloudflare Pages, Netlify, GitHub Pages, Vercel, or a traditional web host). Configure the publish directory as the repository root. No build command required. If hosted in a subfolder, relative URLs continue to work.

## Before going public

- Confirm Kannada translations and spelling with a fluent reviewer.
- Add real privacy policy and contact information before collecting personal data.
- Replace disabled store placeholders with verified live store URLs after publication.
- Verify that your brand artwork is cleared for use.
- Add a custom domain and SEO/social preview metadata.
- This site deliberately collects **no** personal information and has no fake waitlist or app-download actions.

## Next Claude/Codex prompt

Read `README.md`, `config/locales.json`, `css/styles.css`, `js/main.js`, and `index.html`. Continue building this existing static bilingual Havyaka Chavadi website. Preserve the provided assets and all translation keys. Every new user-visible string must be added to both English and Kannada dictionaries in `config/locales.json`. Keep dark/light/auto themes, mobile accessibility, and the existing navy/gold/ivory brand palette. Do not invent store links or enable personal-data collection without a working backend and privacy policy. Improve the visual polish, test on mobile and desktop, and report changes.
