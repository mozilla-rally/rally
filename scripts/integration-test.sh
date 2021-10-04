#!/bin/bash
set -eo pipefail

echo "Testing Firefox, developer mode, headless."
npm run test:integration:jest -- --test_browser=firefox --load_extension=true --headless_mode=true 2>&1 | tee integration.log

# FIXME Chrome Headless mode does not support extensions, need to set up a display server if we want this to work.
# npm run test:integration:jest -- --test_browser=chrome --load_extension=true --headless_mode=false 2>&1 | tee integration.log
