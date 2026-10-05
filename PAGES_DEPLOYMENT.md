# GitHub Pages release process

This repository uses **legacy GitHub Pages** from the `main` branch root. The site served at `https://eng40scricket.github.io/eng40s-worldcup-2026/` is the static Vite artifact committed at the repository root.

After changing the website source, rebuild the Pages artifact before committing:

```bash
GITHUB_PAGES=true pnpm build
rm -rf assets
cp dist/public/index.html ./index.html
cp -R dist/public/assets ./assets
touch .nojekyll
```

Then run `pnpm check`, verify the site at the repository Pages path, and commit both source changes and the regenerated root `index.html` / `assets/` artifact. The `GITHUB_PAGES=true` value preserves the `/eng40s-worldcup-2026/` base path for assets and routing; do not use it for the normal Manus preview.
