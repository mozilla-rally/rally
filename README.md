A demo add-on for Ion Studies.

This requires [Firefox](https://www.mozilla.org/en-US/firefox/) 78.0 or newer, which supports the [new `browser.telemetry.submitEncryptedPing` WebExtension API](https://bugzilla.mozilla.org/show_bug.cgi?id=1634557).

NOTE - Only unbranded Firefox builds such as [Nightly](https://nightly.mozilla.org) will be able to load privileged APIs without a special signing key.

```console
PIONEER_ID="abc123"
FIREFOX_BINARY="/Applications/Firefox Nightly.app/Contents/MacOS/firefox"
web-ext run --pref=extensions.experiments.enabled=true \
            --pref=toolkit.telemetry.pioneerId="${PIONEER_ID}" \
            --browser-console \
            --firefox-binary "${FIREFOX_BINARY}"
 ```

To see extra details on what Firefox Telemetry is doing, enable Trace log level with `--pref=toolkit.telemetry.log.level=Trace`.

On startup, this demo add-on sends an encrypted ping containing the current date and time to Mozilla's Telemetry servers.

The schema for encrypted payloads sent via `browser.telemetry.submitEncryptedPing` is defined in [the Mozilla pipeline schema repository](https://github.com/mozilla-services/mozilla-pipeline-schemas/tree/master/schemas/pioneer-debug/debug). In this case `pioneer-debug` is the schema namespace and `debug` is the schema name. These are defined in [manifest.json](manifest.json).

The schema for the new `manifest.json` entries for the `telemetry` key is [defined here](https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json).
