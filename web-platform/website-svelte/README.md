# Rally Web Platform

This repository contains the code needed to build the Rally Web Platform.

Mozilla Rally is a program that allows you to donate your browsing data to help us understand the Web, how people interact with it, and how people use their browsers
(see [this Mozilla Blog post](https://blog.mozilla.org/en/mozilla/take-control-over-your-data-with-rally-a-novel-privacy-first-data-sharing-platform/) for more information).
Participation in Mozilla Rally is strictly voluntary.

The Rally Web Platform consists of:

- A static website, built with Svelte.
- A storage and authentication backend, powered by Firebase.
- One or more studies (implemented as WebExtensions) which collect and submit user browsing data.

The website is used to create/log in to a Rally account, and to join and leave studies. Studies must be installed
from the appropriate browser store (addons.mozilla.org, Chrome Web Store, etc).

Study extensions are based on the [Rally Study Template](https://github.com/mozilla-rally/study-template).

## Requirements

- [Node.js](https://nodejs.org/en/) v16
- [Firebase](https://firebase.google.com/docs/cli)
  - Authentication
  - Functions
  - Cloud Firestore
  - Hosting
- [Java SDK](https://openjdk.java.net/) v18 for Firebase emulators

## Quickstart

1. Clone this repository.
2. Run `npm install`
3. Run `npm run dev` to spin up the dev environment at `http://localhost:3000`
4. Run `npm run build` to build the app; the results will be in `/build`

The site will be ready for use when you see Svelte start up:

```
  SvelteKit v1.0.0-next.141

  local:   http://localhost:3000
  network: not exposed

  Use --host to expose server to other devices on this network
```

## Tests

Integration tests can be run with:

`npm run test:integration`

This uses Selenium and the Firebase Emulators to run the full Rally Web Platform stack and test that
the various supported UX flows work as expected.

This repository comes (aspirationally) with unit tests:
`npm run test:unit`

These are currently severely underdeveloped right now, we are currently prioritizing
integration testing.

## Emulating the server backend (Firebase)

The `npm run dev` command automatically runs the full set of Firebase emulators required for Rally, as well as the
Svelte web app. There is a Firebase emulator UI which you may use that runs on `http://localhost:4000`.

It then watches for changes and automatically reloads services:

- the Rally Svelte website (`./src`)
- Rally Cloud Functions (`./functions/src`)
  - this includes the static list of studies in `./functions/src/studies.ts`
- Firestore Rules (`./firestore.rules`)

NOTE: if you only want to run the Svelte web app and nothing else, you may use:
`npm run dev:web`

However, you must first configure a valid Firebase backend in `./static/firebase.config.json` for the site to function. See the
`./config/` directory for examples.

`npm run dev` automatically manages this configuration for you, since it uses local emulators for the Firebase backend.

### Configuring the Rally Web Platform website and WebExtensions to use the emulators

When the website is re-built in "emulator" mode, it will automatically deploy to the emulated Firebase Hosting service:
`npm run build:web:emulator`

Clients wishing to connect to the Firebase emulators, including the website and any WebExtensions, must set
this explicitly in their code after initializing the services.

Connecting to the Firebase Authentication emulator:

```ts
const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099");
```

Connecting to the Firebase Firestore emulator:

```ts
db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);
```

For the Rally Web Platform, this is done in: `./src/lib/stores/initialize-firebase.js` and automatically enabled when built in
emulator mode.

## Glean

The Rally Web Platform uses [Glean](https://docs.telemetry.mozilla.org/concepts/glean/glean.html) pings to send enrollment and demographic information to a secure analysis environment.

Glean is **disabled by default** when using the Firebase Emulator (i.e. for development and testing). However it can be **explicitly enabled** by setting the `ENABLE_GLEAN` environment variable to `true`. When Glean is enabled in this way, pings will be logged, and will show up in the official Glean Debug Viewer under the [MozillaRally](https://debug-ping-preview.firebaseapp.com/pings/MozillaRally) tag (note that the ping payload is encrypted before being sent to the Debug Viewer; the data will be obfuscated but you can still see ping type and receiving time).

## Deploying

CircleCI is used to generate build artifacts, which are deployed to [the staging environment](https://stage.rally-web.nonprod.dataops.mozgcp.net).

NOTE: if you want to deploy to your own environment, you must either:

1. `firebase login` and use your own GCP account.
2. point `GOOGLE_APPLICATION_CREDENTIALS` shell variable to a GCP service account JSON file. The service account must have the role "Cloud Build Service Account".

The first option is the simplest for occasional manual deployments, the second is necessary if you're doing automated deployment from CI.

NOTE: if the Firebase environment you are deploying to is not set up yet, see the next section.

First, set your project name as a shell environment variable. NOTE - If you don't yet have a Firebase project set up, see the next section.

`FIREBASE_PROJECT_NAME="my-firebase-project"`

Build the site in production mode:
`firebase use ${FIREBASE_PROJECT_NAME}`
`npm run build`
`npm run config:web`

NOTE - if you are not logged into Firebase then it will not be able to automatically detect project name and details.
If you want to build in a restricted environment, then make sure to copy the correct configuration file after building:

`npm run build`
`cp config/firebase.config.${FIREBASE_PROJECT_NAME}.json ./static/firebase.config.json`

Review `./firebase.json` which contains the server configuration, `./firebaserc` which contains your project names and aliases, and
`./build/firebase.config.json` which contains the website configuration.

When ready, deploy to your project:

`firebase deploy --project ${FIREBASE_PROJECT_NAME}`

The following services will be deployed

- Cloud Firestore Rules from `./firestore.rules`
- Cloud Functions from `functions/src/index.ts`
- Hosting from `./build`

A successful deploy should look something like this:

```
=== Deploying to '${FIREBASE_PROJECT_NAME}'...

i  deploying firestore, functions, hosting
i  cloud.firestore: checking firestore.rules for compilation errors...
✔  cloud.firestore: rules file firestore.rules compiled successfully
i  functions: ensuring required API cloudfunctions.googleapis.com is enabled...
i  functions: ensuring required API cloudbuild.googleapis.com is enabled...
✔  functions: required API cloudbuild.googleapis.com is enabled
✔  functions: required API cloudfunctions.googleapis.com is enabled
i  functions: preparing functions directory for uploading...
i  functions: packaged functions (285.95 KB) for uploading
i  firestore: latest version of firestore.rules already up to date, skipping upload...
✔  functions: functions folder uploaded successfully
i  hosting[${FIREBASE_PROJECT_NAME}]: beginning deploy...
i  hosting[${FIREBASE_PROJECT_NAME}]: found 94 files in build
✔  hosting[${FIREBASE_PROJECT_NAME}]: file upload complete
✔  firestore: released rules firestore.rules to cloud.firestore
i  functions: updating Node.js 14 function rallytoken(us-central1)...
i  functions: updating Node.js 14 function loadFirestore(us-central1)...
i  functions: updating Node.js 14 function addRallyUserToFirestore(us-central1)...
✔  functions[rallytoken(us-central1)]: Successful update operation.
✔  functions[loadFirestore(us-central1)]: Successful update operation.
✔  functions[addRallyUserToFirestore(us-central1)]: Successful update operation.
i  functions: cleaning up build files...
Function URL (loadFirestore(us-central1)): https://us-central1-${FIREBASE_PROJECT_NAME}.cloudfunctions.net/loadFirestore
Function URL (rallytoken(us-central1)): https://us-central1-${FIREBASE_PROJECT_NAME}.cloudfunctions.net/rallytoken
i  hosting[${FIREBASE_PROJECT_NAME}]: finalizing version...
✔  hosting[${FIREBASE_PROJECT_NAME}]: version finalized
i  hosting[${FIREBASE_PROJECT_NAME}]: releasing new version...
✔  hosting[${FIREBASE_PROJECT_NAME}]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/${FIREBASE_PROJECT_NAME}/overview
Hosting URL: https://${FIREBASE_PROJECT_NAME}.web.app
```

## One-time Firebase server setup

The `./firebase.json` holds the desired services and basic configuration, but there are a number of one-time configuration changes that must be made using the [Firebase console](https://console.firebase.google.com/):

1. Create new Web app in UI under Project Settings -> Your apps

Make sure to choose ["Native" not "Datastore" mode for Cloud Firestore](https://cloud.google.com/datastore/docs/firestore-or-datastore#choosing_a_database_mode).

Set your project name as a shell environment variable:

`FIREBASE_PROJECT_NAME="my-firebase-project"`
​
Place the returned configuration into `./firebase.config.${FIREBASE_PROJECT_NAME}.json`, then set up your project and an alias (dev/stage/prod/etc):
`firebase use --add`

And complete the prompts:

```
? Which project do you want to add?
? What alias do you want to use for this project? (e.g. staging)
```

​
Then, enable the following in the Firebase console:

- Authentication, along with the email and Google providers.
- Cloud Firestore
- Hosting

1. Grant the ability to generate custom tokens to your Firebase functions:

   1. Add the IAM Service Account Credentials API at https://console.developers.google.com/apis/api/iamcredentials.googleapis.com/overview?project=${FIREBASE_PROJECT_NAME}
   2. Give the "Service Account Token Creator" role to your appspot service account in https://console.cloud.google.com/iam-admin/iam?authuser=0&project=${FIREBASE_PROJECT_NAME}.
   3. NOTE - be sure to replace `${FIREBASE_PROJECT_NAME}` above

2. Deploy

Build the site in production mode:
`firebase use ${FIREBASE_PROJECT_NAME}`
`npm run build`
`npm run config:web`

NOTE - if you are not logged into Firebase then it will not be able to automatically detect project name and details.
If you want to build in a restricted environment, then make sure to copy the correct configuration file after building:

`npm run build`
`cp config/firebase.config.${FIREBASE_PROJECT_NAME}.json ./static/firebase.config.json`

Then deploy to your Firebase project:
`firebase deploy --project ${FIREBASE_PROJECT_NAME}`

If you are still on the free billing plan, you will get a message similar to the following:
​

```
Error: Your project ${FIREBASE_PROJECT_NAME} must be on the Blaze (pay-as-you-go) plan to complete this command. Required API cloudbuild.googleapis.com can't be enabled until the upgrade is complete. To upgrade, visit the following URL:
​
https://console.firebase.google.com/project/${FIREBASE_PROJECT_NAME}/usage/details
​
Having trouble? Try firebase [command] --help
```

Upgrading to the Blaze plan is necessary for access to Firebase Cloud Functions.

Re-deploy using the above command, and you should now be able to access your site at:

https://${FIREBASE_PROJECT_NAME}.web.app

## Versioning

The current version of the site is available at: `<hostname>/version.json`. There are currently no releases, the main branch is
automatically deployed to dev environment.

As we add a staging and production environment, we will start using tags.

## Organization

- `src/lib` – the components and utility functions utilized in the frontend.
  - `src/lib/stores` – contains the overarching application store & any derived stores. These set in the context of the layouts in `src/routes`, which gives access to the global store to all children components (including pages).
  - `src/lib/views` – the standalone views that get utilized for individual pages. We are breaking these out separately because we utilize the same content & functionality blocks on multiple routes (e.g. for onboarding, `/welcome/terms` and for the main view, `/terms`).
  - The rest of the components and functions in `/src/lib/` are used throughout the page components and the views.
- `src/routes` – the page components utilized in the routes. Sveltekit's routing is directory-based; so `src/routes/terms/index.svelte` maps to `/terms`, and `src/routes/welcome/profile/index.svelte` maps to `/welcome/profile`.

- `functions` - Firebase functions needed to support the Rally Web Platform.

`svelte.config.js` – contains the configuration of the Sveltekit app. Sveltekit utilizes Vite under the hood, and has support for both Vite and Rollup plugins.

`config/firebase.config.*.json` – the Firebase configuration files used by the Svelte site.

`firebase.json` - contains the server-side configuration for this Firebase project.

## Storybook

To start storybook in development mode, run npm run storybook

Test existing components by adding a "story" in `src/stories/components`, using the `stories.svelte` extension

Please check [the Storybook documentation] https://storybook.js.org/docs/svelte/writing-stories/introduction for proper story definition
