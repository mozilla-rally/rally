#!/bin/bash
set -eo pipefail

export PATH=$PATH:./node_modules/.bin

# Start website
pushd ../website && npm run dev && popd&

echo "Testing Firefox"

firebase emulators:exec \
  -c ../firebase/firebase.json \
  --project demo-rally \
  "npm run load:data && npm run jest -- --browser_type=firefox --headless_mode=true" 2>&1 | tee integration.log


# echo "Testing Chrome"

killall node