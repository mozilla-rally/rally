#!/bin/bash
set -eo pipefail

XVFB_RUN() {
    if hash xvfb-run 2>/dev/null
    then
        xvfb-run "$@"
    else
        echo "WARN: xvfb-run must be installed to run Chrome headless"
        "$@"
    fi
}

# NOTE Firefox only supports manifest v2, re-add this when we have support and/or it ships manifest v3.
echo "Testing Firefox headless with extension"
npm run test:integration:jest -- --test_browser=firefox --load_extension=true --headless_mode=true  2>&1 | tee integration.log
# NOTE Chrome Headless mode does not support extensions, so we use `xvfb` as the display server.
# FIXME Chrome is crashing when running this under under Selenium on Linux only, disable for now.
echo "Testing Chrome non-headless with extension"
XVFB_RUN npm run test:integration:jest -- --test_browser=chrome --load_extension=true --headless_mode=false 2>&1 | tee integration.log
