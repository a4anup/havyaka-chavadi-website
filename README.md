# Havyaka Chavadi — Bilingual Promotional Website

A complete static landing page using the **eight original assets** from the supplied HavyakaChavadi ZIP.

## Start in VS Code

1. Open this folder in VS Code.
2. In a terminal, run `python3 -m http.server 8080` (or `npx serve .`).
3. Open http://localhost:8080.

**Do not double-click index.html**: browser restrictions prevent `fetch()` from loading the translation JSON over `file://`.

No npm install, build system, API keys, or backend is needed.

## Edit

- `index.html`: sections, content layout and SEO structure.
- `css/styles.css`: all shared design tokens, responsive styles, dark theme.
- `js/main.js`: language switcher, theme switcher, mobile menu.
- `config/locales.json`: **single source of truth for all English and Kannada UI text**. Both locales have identical keys.
- `assets/`: supplied logos, splash image and app icons. No replacements were generated.

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
