# Mozilla Rally

This mono-repository contains [Rally](https://rally.mozilla.org/) and its related codebase. Rally enables people to contribute, gain insight and earn value from their own data through transparency, ethical and consensual practices.  We are working towards building independent insights about connected life and countering the power imbalance that results from the same organizations controlling access to data while they are also collecting and benefiting most from it. 

## Setup Development Environment

* Rally uses [Microsoft Rush.js](https://rushjs.io/) to build, test and deploy this monorepo. Please familiarize yourself with [Rush.js development guide](https://rushjs.io/pages/developer/new_developer/) to install and get started with rush. To build the projects in this repo, use these shell commands from the root of the repo:  
    ```  
    npm install -g @microsoft/rush  
    rush install  
    rush build  
    ```  
    For more information, see the documentation at:  https://rushjs.io/

* For CI/CD pipelines, we use Github actions that are maintained within [.github/workflows](https://github.com/mozilla-rally/rally/tree/main/.github/workflows) folder. This is where we build repo within pull requests and publish packages / deploy firebase functions.

## MonoRepo Structure
* /.github/workflow - Github actions for CI/CD.
* /configuration - Root for configuration related projects.
  * /configuration/firebase - Firebase configuration for various environments (new).
* /extensions - Root for all extensions and extensions related code.
  * /extensions/sdk - Rally extensions SDK location.
* /external - External patched libraries (e.g. jest-webextension-mock)
* /tools - All tooling related code and configuration
  * /tools/typescript - Contains standard typescript, prettier and eslint configurations. 
* /web-platform - Root for web platform and related codebase.
  * /web-platform/functions - Web platform functions.
  * /web-platform/website - Web platform website (React).
