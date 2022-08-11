# Release Process the for Rally Attention Stream browser extension

## Version bump

For any release, the version numbers in both `package.json` and `manifest.*.json` must be bumped, using semantic versioning.

Modify these and push to a `release` branch on GitHub. Merge any changes from `main` onto the release branch as well:

```
% git merge --no-ff main
```

## Create a Github release

Create a new github release, prefixing the tag with `v` (`v1.2.3` for version `1.2.3`). Attach the unsigned release XPI that you
built in the previous step.

## Build extension
### TODO this section will be performed by CI in the near future.

### Chrome

Chrome (and manifest v3) are the default on the `release` branch:

```
% (npm i && npm run build && npm run package) 2>&1 | tee build-chrome.log
```

The build output will be in `./web-ext-artifacts`. Rename to `rally_attention_stream-${version}-chrome.zip`.

### Firefox

Firefox (and manifest v2) support is maintained on a separate branch:

```
% git checkout firefox-mv2-support
% git merge --no-ff release
% git tag v${version}-attention-stream-firefox
% git push origin v${version}-attention-stream-firefox
```

```
% (npm i && npm run build && npm run package) 2>&1 | tee build-firefox.log
```

The build output will be in `./web-ext-artifacts`. Rename to `rally_attention_stream-${version}-firefox.zip`.

### Upload to releases page

Upload the build logs and `.zip` artifacts to the GitHub releases page.

## Compare extension package to live version

If there is a previous version of this extension live on AMO, download it and compare to the current package:

https://addons.mozilla.org/en-US/firefox/addon/political-covid-19-news-study/versions/

### TODO add Chrome store link

`.xpi` and `.crx` files are `.zip` files, unzip these into seperate directories and run recursive diff (`diff -r`).
Only expected changes should be present:

- `META-INF/` contains the signing info, only in the live AMO version
- `manifest.json` should have a newer version
- any code changes should be present (may be rolled up)

## Merge `release` branch to `main`

Be sure to open a PR and merge the `release` branch back to `main`.

## Submit to AMO and CWS

Upload the unsigned extension to AMO https://addons.mozilla.org/en-US/developers/, using the extension and source code ZIP files from the github
release in the previous step.

If this is a new study, including an appropriate badge ("by Firefox", or "Verified").
