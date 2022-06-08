# Rally Web Platform - Continuous Integration and Deployment

The `rally-web-platform` repo uses Circle CI for continuous integration and deployment:

- build and test on each PR
- deploy to dev site on merge to master

Not yet but in the near future, the deployment model will change slightly:

- deploy to staging site on merge to master
- deploy to production on tag

## Circle CI deployment setup

In order to do deployment, Circle CI needs access to deploy to Firebase. The recommended approach is to
generate tokens explicitly for CI use, and to set these tokens as environment variables in Circle CI.

Each github repository that has Circle set up has a settings page:
https://app.circleci.com/pipelines/github/mozilla-rally/rally-web-platform

To change tokens, press "Project Settings" then "Environment Variables". The `FIREBASE_TOKEN` is used to
deploy to Firebase (using [firebase-tools](https://firebase.google.com/docs/cli)). This token is generated using:

```sh
firebase login:ci
```

This command prompts you to log in to a Google account with access to GCP, and generates a token.
NOTE: this should be done using a Service Account, and not your personal account, in order to get a long-lived token
that isn't tied to any particular developer.
