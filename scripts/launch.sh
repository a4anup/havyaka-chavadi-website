#!/bin/sh
# Launch day: replace the coming-soon page with the full website.
# Run from anywhere:  sh scripts/launch.sh   then   git push
set -e
cd "$(dirname "$0")/.."
[ -f site.html ] || { echo "site.html not found: the site may already be launched."; exit 1; }
git rm -q index.html css/coming-soon.css js/coming-soon.js
git mv site.html index.html
perl -0pi -e 's#<meta name="robots" content="noindex"><!-- pre-launch only: scripts/launch.sh removes this -->##' index.html
if grep -q noindex index.html; then echo "Could not remove the noindex tag from index.html; check it before pushing."; exit 1; fi
git add index.html
git commit -q -m "Launch the full Havyaka Chavadi website"
echo "Done. The full site is now index.html. Run 'git push' to make it live."
