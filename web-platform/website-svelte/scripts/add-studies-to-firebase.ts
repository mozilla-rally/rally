import admin from "firebase-admin";

import { studies } from "../functions/src/studies";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

function addStudyToFirebase(studyId, study) {
  admin
    .firestore()
    .collection("studies")
    .doc(studyId)
    .set(study, { merge: true });
}

for (const [studyId, study] of Object.entries(studies)) {
  console.info(`Loading study ${studyId} into Firestore`);
  addStudyToFirebase(studyId, study);
}
