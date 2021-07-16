# @mozilla/rally

This is the Rally partner support library, used to manage the lifecycle of Rally studies.

This library is used in the [Rally Study Template](https://github.com/mozilla-rally/study-template).

## TypeScript vs. JS

This project is written in [TypeScript](https://www.typescriptlang.org/), which you may use directly from your TypeScript code, or you may use the TypeScript compiler to build `rally.js`.

## Building `rally.js`

First, install dependencies:

```bash
npm install
```

Then, build `rally.js`:

```bash
npm run build
```

## Manual testing using `npm link`
Manual testing can be done as follows:

1. Run `npm link` in the `support/` directory.
2. In the directory of the testing grounds (e.g. the [study-template](https://github.com/mozilla-rally/study-template)), run `npm link "@mozilla/rally"`. This will make the test project use the local version of `@mozilla/rally`, automatically tracking any change to it.

And to undo the linking:

3. Run `npm unlink "@mozilla/rally"` in the testing directory.
4. Run `npm unlink` in the `support/` directory.
