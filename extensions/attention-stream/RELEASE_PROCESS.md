# Release Process the for Mozilla Rally browser extension

## Version bump

For any release, the version numbers in both `package.json` and `manifest.*.json` must be bumped, using semantic versioning.

Modify these and push to a `release` branch on GitHub. Merge any changes from `main` onto the release branch as well:

```
% git merge --no-ff main
```

## Create a Github release

Create a new github release, prefixing the tag with `v` (`v1.2.3-rally-extension` for version `1.2.3`). Attach the unsigned release XPI that you
built in the previous step.

## Build extension

### Firefox

A Firefox-compatible manifest v2 extension is built by a GitHub Action. The extension [is stored as an Artifact](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts).

### Chrome

A Chrome-compatible manifest v3 extension is built by a GitHub Action. The extension [is stored as an Artifact](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts).


### Upload to releases page

Upload the build logs and `.zip` artifacts to the GitHub releases page.

## Compare extension package to live version

If there is a previous version of this extension live on AMO, download it and compare to the current package:

https://addons.mozilla.org/en-US/firefox/addon/mozilla-rally/versions/

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
