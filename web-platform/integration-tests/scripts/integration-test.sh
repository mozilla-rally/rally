#!/bin/bash
set -eo pipefail

export PATH=$PATH:./node_modules/.bin

# If already running, kill website process
kill $(lsof -t -i:3000) || true

# Start website
pushd ../website && npm run dev:emulator && popd&


echo "Testing Chrome"

firebase emulators:exec \
  -c ../firebase/firebase.json \
  --project demo-rally \
  --only auth,functions,firestore \
  "npm run load:data && npm run jest -- --browser_type=chrome --headless_mode=false" 2>&1 | tee integration.log



echo "Testing Firefox"

firebase emulators:exec \
  -c ../firebase/firebase.json \
  --project demo-rally \
  --only auth,functions,firestore \
  "npm run load:data && npm run jest -- --browser_type=firefox --headless_mode=false" 2>&1 | tee integration.log

killall node