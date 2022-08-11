# Release Process for News Disinformation Study

## Version bump

For any release, the version numbers in both `package.json` and `manifest.*.json` must be bumped, using semantic versioning.

Modify these and push to a `release` branch on GitHub.

## Wait for CI to build the extension packages.

CircleCI will a .zip file for the production version of the extension, this will be uploaded to CircleCI as artifacts to the "Build and Lint" job:

https://app.circleci.com/pipelines/github/mozilla-rally/news-disinformation-study?branch=release&filter=all

## Compare extension package to live version

If there is a previous version of this extension live on AMO, download it and compare to the current package:

https://addons.mozilla.org/en-US/firefox/addon/political-covid-19-news-study/versions/

`.xpi` files are `.zip` files, unzip these into seperate directories and run recursive diff (`diff -r`).
Only expected changes should be present:

- `META-INF/` contains the signing info, only in the live AMO version
- `manifest.json` should have a newer version
- any code changes should be present (may be rolled up)

## Create a Github release

Create a new github release, prefixing the tag with `v` (`v1.2.3` for version `1.2.3`). Attach the unsigned release XPI that you
built in the previous step.

Upload the artifacts from CI to the release page.

## Merge `release` branch to `main`

Be sure to open a PR and merge the `release` branch back to `main`.

## Submit to AMO

Upload the unsigned extension to AMO https://addons.mozilla.org/en-US/developers/, using the extension and source code ZIP files from the github
release in the previous step.

If this is a new study, ask the add-ons team in #addons on Slack to enable an appropriate badge ("by Firefox", or "Verified").
