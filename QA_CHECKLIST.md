# Checklist to be used when running through a manual test of the Rally ecosystem

## Components of the system to be tested
- Rally Web Platform
- Rally Extension

## Test checklist
- [ ] Install extension first flow
  - [ ] Open Extension store page and install extension
  - [ ] Create an account
    - [ ] Google Auth
    - [ ] Email / Password
      - [ ] Valid email / valid password
      - [ ] Invalid email
      - [ ] Invalid password
      - [ ] Complete email verification
  - [ ] Join Study (study page should reflect that enrollment is incomplete)

- [ ] Creating an account on the web platform first
  - [ ] Google Auth
  - [ ] Email / Password
    - [ ] Valid email / valid password
    - [ ] Invalid email
    - [ ] Invalid password
    - [ ] Complete email verification
- [ ] Signing in
  - [ ] Google Auth
  - [ ] Email / Password
    - [ ] Valid email / valid password
    - [ ] Invalid email
    - [ ] Invalid password 
    - [ ] Sign in with unverified email account
- [ ] Joining a study
  - [ ] Inspect the extension that it has properly authenticated is communicating with platform
- [ ] Manage your profile
- [ ] Account settings
- [ ] Edit Email
  - [ ] Valid email
  - [ ] Invalid email
- [ ] Edit Password
  - [ ] Valid password
  - [ ] Invalid password
- [ ] Forgot Password
- [ ] Leaving the study
- [ ] Deleting your account
- [ ] Google Analytics
- [ ] Attribution


