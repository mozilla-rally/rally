#!/bin/bash
set -eo pipefail

export PATH=$PATH:./node_modules/.bin

echo "Building test extension..."
pwd
pushd tests/integration/extension
npm install && npm run build && npm run package
popd

echo "Testing Firefox, no extension"
firebase emulators:exec --project demo-rally "npm run load:data && npm run test:integration:jest -- --test_browser=firefox --load_extension=false --headless_mode=true" 2>&1 | tee integration.log
echo "Testing Firefox with extension"
firebase emulators:exec --project demo-rally "npm run load:data && npm run test:integration:jest -- --test_browser=firefox --load_extension=true --headless_mode=true"  2>&1 | tee integration.log
# echo "Testing Chrome, no extension"
# firebase emulators:exec --project demo-rally "npm run load:data && npm run test:integration:jest -- --test_browser=chrome --load_extension=false --headless_mode=true" 2>&1 | tee integration.log

# FIXME Chrome Headless mode does not support extensions, need to set up a display server if we want this to work.
# firebase emulators:exec --project demo-rally "npm run load:data && npm run test:integration:jest -- --test_browser=chrome --load_extension=true --headless_mode=false" 2>&1 | tee integration.log
