# Release Process the for Rally Attention Stream browser extension

## Version bump

For any release, the version numbers in both `package.json` and `manifest.*.json` must be bumped, using semantic versioning.

Modify these and push to a `release` branch on GitHub. Merge any changes from `main` onto the release branch as well:

```
% git merge --no-ff main
```

## Create a Github release

Create a new github release, prefixing the tag with `v` (`v1.2.3-attention-stream` for version `1.2.3`). Attach the unsigned release XPI that you
built in the previous step.

## Build extension

### Firefox

Firefox (and manifest v2) support is the default on the `main` and `release` branches, and the extension is built
by a GitHub Action. The extension [is stored as an Artifact](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts).

Rename to `rally_attention_stream-${version}-firefox.zip`

### Chrome
### TODO this section will be performed by CI in the near future, see https://github.com/mozilla-rally/rally/issues/192

Chrome (and manifest v3) are the default on the `release-chrome` branch:

First, merge any changes and tag them:

```
% git checkout release-chrome
% git merge --no-ff main
% git tag v${version}-attention-stream-chrome
% git push origin v${version}-attention-stream-chromev q
```

```sh
(npm i && npm run build && npm run package) 2>&1 | tee build-chrome.log
```

The build output will be in `./web-ext-artifacts`. Rename to `rally_attention_stream-${version}-chrome.zip`.

### Upload to releases page

Upload the build logs and `.zip` artifacts to the GitHub releases page.

## Compare extension package to live version

If there is a previous version of this extension live on AMO, download it and compare to the current package:

https://addons.mozilla.org/en-US/firefox/addon/attention-stream/versions/

### TODO add Chrome store link

`.xpi` and `.crx` files are `.zip` files, unzip these into seperate directories and run recursive diff (`diff -r`).
Only expected changes should be present:

- `META-INF/` contains the signing info, only in the live AMO version
- `manifest.json` should have a newer version
- any code changes should be present (may be rolled up)

## Merge `release` branch to `main`

Be sure to open a PR and merge the `release` branch back to `main`.

## Submit to Addons.Mozilla.Org (AMO)

Upload the unsigned extension to AMO https://addons.mozilla.org/en-US/developers/, using the extension and source code ZIP files from the github
release in the previous step.

If this is a new study, including an appropriate badge ("by Firefox", or "Verified").

## Submit to Chrome Web Store (CWS)

Upload the unsigned extension to CWS https://chrome.google.com/webstore/category/extensions, using the extension ZIP file from the github release
in the previous step.
