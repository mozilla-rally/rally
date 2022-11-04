#!/bin/bash
set -eo pipefail

export PATH=$PATH:./node_modules/.bin

# Start website
pushd ../website && npm run dev && popd&

echo "Testing Firefox, no extension"

firebase emulators:exec \
  -c ../firebase/firebase.json \
  --project demo-rally \
  "npm run load:data && ./node_modules/.bin/jest --forceExit --detectOpenHandles -- --test_browser=firefox --load_extension=false --headless_mode=true ./src" 2>&1 | tee integration.log


# echo "Testing Firefox with extension"

# echo "Testing Chrome, no extension"

# echo "Testing Chrome, with extension"

killall node