#!/bin/bash
set -eo pipefail

export PATH=$PATH:./node_modules/.bin

# Kill previous node processes
killall node

# Start website
#pushd ../website
#npm run dev&
#WEBSITE_PID=$!
#popd

echo "Testing Firefox, no extension"

firebase emulators:exec \
  -c ../firebase/firebase.json \
  --project demo-rally \
  "npm run load:data && ./node_modules/.bin/jest --forceExit --detectOpenHandles -- --test_browser=firefox --load_extension=false --headless_mode=true ./src" 2>&1 | tee integration.log

echo "Testing Firefox with extension"
echo "Ashish"
jobs
#firebase emulators:exec -c \
#  ../firebase/firebase.json --project demo-rally \
#  "npm run load:data && ./node_modules/.bin/jest --test_browser=firefox --load_extension=true --headless_mode=true" 2>&1 | tee integration.log

#firebase emulators:exec --project demo-rally "npm run load:data && npm run test:integration:jest -- --test_browser=firefox --load_extension=true --headless_mode=true"  2>&1 | tee integration.log

# echo "Testing Chrome, no extension"
# firebase emulators:exec --project demo-rally "npm run load:data && npm run test:integration:jest -- --test_browser=chrome --load_extension=false --headless_mode=true" 2>&1 | tee integration.log

# FIXME Chrome Headless mode does not support extensions, need to set up a display server if we want this to work.
# firebase emulators:exec --project demo-rally "npm run load:data && npm run test:integration:jest -- --test_browser=chrome --load_extension=true --headless_mode=false" 2>&1 | tee integration.log
