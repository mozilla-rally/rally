# Release Process for Rally Study 01

## Version bump

For any release, the version numbers in both `package.json` and `manifest.json` must be bumped, using semantic versioning.

Modify these and open a PR with your branch named `x.y.x-release`.

## Build the release XPI

Before pushing the PR, ensure that building an unsigned XPI works and that it installs and works in Nightly (see `STUDY_QA.md`):

```bash
npm install
npm run build:addon
```

The output will be in `./web-ext-artifacts`.

## Create a Github release

Create a new github release, prefixing the tag with `v` (`v1.2.3` for version `1.2.3`). Attach the unsigned release XPI that you
built in the previous step.

## Submit to AMO

Upload the unsigned XPI to AMO https://addons.mozilla.org/en-US/developers/, using the XPI and source code ZIP from the github
release in the previous step.

If this is a new study, ask the add-ons team in #addons on Slack to enable an appropriate badge ("by Firefox", or "Verified").
