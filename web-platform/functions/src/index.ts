import admin from "firebase-admin";
import functions, { Change, EventContext } from "firebase-functions";
import { DocumentSnapshot } from "firebase-functions/v1/firestore";
import { v4 as uuidv4 } from "uuid";
import { useAuthentication } from "./authentication";
import { useCors } from "./cors";
import { studies } from "./studies";
import { isDeepStrictEqual } from "util";
import * as gleanPings from "./glean";
import assert from "assert";
import Client from "@sendgrid/client";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const OFFBOARD_URL = "https://rally.mozilla.org/offboarding/index.html";
const UTM_KEYS = ["source", "medium", "campaign", "term", "content"]

export const rallytoken = functions.https.onRequest(async (request, response) =>
  useCors(request, response, async () => {
    await useAuthentication(request, response, async (decodedToken) => {
      if (request.method !== "POST") {
        response.status(500).send("Only POST and OPTIONS methods are allowed.");
        return;
      }

      functions.logger.info(`body type: ${typeof request.body}`, {
        payload: request.body,
      });

      try {
        let studyId;
        if (typeof request.body === "string") {
          const body = JSON.parse(request.body);
          studyId = body.studyId;
        } else {
          studyId = request.body.studyId;
        }

        const rallyToken = await generateToken(decodedToken, studyId);
        functions.logger.info("OK");
        response.status(200).send({ rallyToken });
      } catch (ex) {
        functions.logger.error(ex);
        response.status(500).send();
      }
    });
  })
);

/**
 * Takes a Firebase IDToken for a Rally user, and returns a Rally Token
 * for a restricted-access account (for use with studies).
 *
 * @param {string} decodedToken Decoded Firebase IDToken.
 * @param {string} studyId Rally study ID.
 * @return {Promise<string>} rallyToken
 */
async function generateToken(
  decodedToken: admin.auth.DecodedIdToken,
  studyId: string
) {
  // Firebase will create this account if it does not exist,
  // when the token is first used to sign-in.
  const uid = `${studyId}:${decodedToken.uid}`;
  const rallyToken = await admin
    .auth()
    .createCustomToken(uid, { firebaseUid: decodedToken.uid, studyId });

  return rallyToken;
}

export async function addRallyUserToFirestoreImpl(
  user: admin.auth.UserRecord
): Promise<boolean> {
  functions.logger.info("addRallyUserToFirestore - onCreate fired for user", {
    user,
  });
  if (user.providerData.length == 0) {
    functions.logger.info("Extension users do not get user docs.");
    return false;
  }

  const newRallyId = uuidv4();
  const extensionUserDoc = { rallyId: newRallyId };

  await admin
    .firestore()
    .collection("extensionUsers")
    .doc(user.uid)
    .set(extensionUserDoc, { merge: true });

  const userDoc = {
    createdOn: new Date(),
    uid: user.uid,
  };

  await admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set(userDoc, { merge: true });

  return true;
}

export const addRallyUserToFirestore = functions
  .runWith({ failurePolicy: true })
  .auth.user()
  .onCreate(addRallyUserToFirestoreImpl);

export async function deleteRallyUserImpl(
  user: admin.auth.UserRecord
): Promise<boolean> {
  functions.logger.info("deleteRallyUser fired for user:", user);

  if (user.providerData.length === 0) {
    // This is an extension user; we don't need to do anything
    return true;
  }

  // Delete the user studies subcollection.
  const collectionRef = admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .collection("studies");

  // There will be one document per study here, use batching in case it ever goes over the limit.
  // Work in batches of 5: https://firebase.google.com/docs/firestore/manage-data/transactions#security_rules_limits
  let batch = admin.firestore().batch();
  const userStudyDocs = await collectionRef.get();
  const studyExtensionUIDs = [];
  for (const [count, userStudyDoc] of userStudyDocs.docs.entries()) {
    batch.delete(userStudyDoc.ref);

    // Collect the UIDs for the study-specific auth accounts associated with this user
    studyExtensionUIDs.push(`${userStudyDoc.data().studyId}:${user.uid}`);

    // Count is 0-based, so commit on multiples of 4.
    if (count % 4 === 0) {
      await batch.commit();
      batch = admin.firestore().batch();
    }
  }

  // Do a final commit in case we ended on a partial batch.
  await batch.commit();

  // Delete all the study-specific auth accounts associated with this user
  // Limited to 1000, but it is safe to assume we will not have more than 1000 studies
  await admin.auth().deleteUsers(studyExtensionUIDs);

  // Finally, delete the user document.
  await admin.firestore().collection("users").doc(user.uid).delete();

  return true;
}

export const deleteRallyUser = functions
  .runWith({ failurePolicy: true })
  .auth.user()
  .onDelete(deleteRallyUserImpl);

/**
 *
 * @param {string} studyKey The firestore key.
 * @param {object} study The study object.
 */
async function addRallyStudyToFirestore(
  studyKey: string,
  study: Record<string, unknown>
) {
  await admin
    .firestore()
    .collection("studies")
    .doc(studyKey)
    .set(study, { merge: true });
}

export const loadFirestore = functions.https.onRequest(
  async (request, response) => {
    for (const [studyKey, study] of Object.entries(studies)) {
      console.info(`Loading study ${studyKey} into Firestore`);
      await addRallyStudyToFirestore(studyKey, study);
    }
    response.status(200).send();
  }
);

/*
 * Listen for changes to the User document
 * and initiate the appropriate Glean ping(s)
 */
export async function handleUserChangesImpl(
  change: Change<DocumentSnapshot>,
  context: EventContext
): Promise<boolean> {
  const userID = context.params.userID;
  const rallyID = await getRallyIdForUser(userID);

  // Without Rally ID, we can't make any Glean pings
  // This is bad and should be flagged for inspection
  assert(
    rallyID,
    `Unable to obtain Rally ID for user ID ${userID}. Aborting Glean ping process.`
  );

  // Get an object with the current document value.
  // If the document does not exist, it has been deleted.
  const newUser = change.after.exists ? change.after.data() : null;

  if (!newUser) {
    // User document was deleted
    // Delete the extension user document, now that we've obtained the rallyID
    await admin.firestore().collection("extensionUsers").doc(userID).delete();
  }

  // Get the old document, to compare the enrollment state.
  const oldUser = change.before.exists ? change.before.data() : null;

  if (!newUser || (oldUser && oldUser.enrolled && !newUser.enrolled)) {
    // User document has unenrolled
    functions.logger.info(`Sending unenrollment ping for user ID ${userID}`);
    await gleanPings.platformUnenrollment(rallyID);
    return true;
  }

  if ((!oldUser || !oldUser.enrolled) && newUser.enrolled) {
    // User just enrolled
    functions.logger.info(`Sending enrollment ping for user ID ${userID}`);
    await gleanPings.platformEnrollment(rallyID);
  }

  if (
    !isDeepStrictEqual(
      oldUser && oldUser.demographicsData,
      newUser && newUser.demographicsData
    )
  ) {
    // User updated demographicsData
    functions.logger.info(`Sending demographics ping for user ID ${userID}`);
    await gleanPings.demographics(rallyID, newUser && newUser.demographicsData);
  }

  return true;
}

export const handleUserChanges = functions
  .runWith({ failurePolicy: true })
  .firestore.document("users/{userID}")
  .onWrite(handleUserChangesImpl);

/*
 * Listen for changes to the Study document
 * and initiate the appropriate Glean ping(s)
 */
export async function handleUserStudyChangesImpl(
  change: Change<DocumentSnapshot>,
  context: EventContext
): Promise<boolean> {
  // If the study is being deleted, it's safe to assume this is because the user is being deleted
  // In this case, no pings need to be sent (user deletion ping will take care of everything)
  // So it should be a no-op
  if (!change.after.exists) {
    return true;
  }

  const userID = context.params.userID;
  const firebaseStudyID = context.params.studyID;
  const rallyID = await getRallyIdForUser(userID);

  // Without Rally ID, we can't make any Glean pings
  // This is bad and should be flagged for inspection
  assert(
    rallyID,
    `Unable to obtain Rally ID for user ID ${userID}. Aborting Glean ping process.`
  );

  // Get an object with the current document value.
  // If the document does not exist, it has been deleted.
  const newStudy = change.after.exists ? change.after.data() : null;

  // Get the old document, to compare the enrollment state.
  const oldStudy = change.before.exists ? change.before.data() : null;

  const studyID =
    (newStudy && newStudy.studyId) || (oldStudy && oldStudy.studyId);

  // Without Study ID, we can't construct study-related Glean pings
  // This is bad and should be flagged for inspection
  assert(
    studyID,
    `Couldn't find Glean Study ID for user ID ${userID} and Firebase study ID ${firebaseStudyID}. Aborting Glean ping process.`
  );

  const schemaNamespace = await getSchemaNamespaceforStudy(studyID);

  // Without the schemaNamespace, study-related Glean pings
  // won't be tracked properly by the shredder in the future.
  // This is bad and should be flagged for inspection
  assert(
    schemaNamespace,
    `Couldn't find Glean schemaNamespace for user ID ${userID} and Firebase study ID ${firebaseStudyID}. Aborting Glean ping process.`
  );

  if (!newStudy || (oldStudy && oldStudy.enrolled && !newStudy.enrolled)) {
    // User unenrolled from study
    functions.logger.info(
      `Sending unenrollment ping for study with user ID ${userID} with study ID ${studyID}`
    );
    await gleanPings.studyUnenrollment(rallyID, studyID, schemaNamespace);
    return true;
  }

  if ((!oldStudy || !oldStudy.enrolled) && newStudy.enrolled) {
    // User just enrolled in this study
    functions.logger.info(
      `Sending enrollment ping for study with user ID ${userID} with study ID ${studyID}`
    );
    await gleanPings.studyEnrollment(rallyID, studyID, schemaNamespace);
    return true;
  }

  return true;
}

export const handleUserStudyChanges = functions
  .runWith({ failurePolicy: true })
  .firestore.document("users/{userID}/studies/{studyID}")
  .onWrite(handleUserStudyChangesImpl);

async function getRallyIdForUser(userID: string) {
  const extensionUserDoc = await admin
    .firestore()
    .collection("extensionUsers")
    .doc(userID)
    .get();

  const data = extensionUserDoc.data();

  return (data && data.rallyId) || null;
}

async function getSchemaNamespaceforStudy(studyID: string) {
  const studyDoc = await admin
    .firestore()
    .collection("studies")
    .doc(studyID)
    .get();

  const data = studyDoc.data();

  return (data && data.schemaNamespace) || null;
}

/**
 * Lists users.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
export const countRallyUsers = functions.https.onRequest(async (req, res) => {
  const userCounts = new Map();
  const extensionCounts = new Map();
  await listAllUsers(undefined, userCounts, extensionCounts);

  console.log({ users: Array.from(userCounts), extensions: Array.from(extensionCounts) });
  res.status(200).send("OK");
});

const listAllUsers = async (nextPageToken: string | undefined, userCounts: Map<string, number>, extensionCounts: Map<string, number>) => {
  // List batch of users, 1000 at a time.
  const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
  listUsersResult.users.forEach((userRecord) => {
    let providerId: string = userRecord.providerData[0]?.providerId;
    let studyId;

    if (providerId && userRecord.emailVerified === false) {
      providerId += "-unverified";
    }

    if (userRecord?.uid?.includes(":")) {
      studyId = userRecord.uid.split(":")[0];
    }

    if (providerId) {
      const count = userCounts.get(providerId) || 0;
      userCounts.set(providerId, count + 1);
    }
    if (studyId) {
      const count = extensionCounts.get(studyId) || 0;
      extensionCounts.set(studyId, count + 1);
    }
    // console.log('user', userRecord.toJSON());
  });
  if (listUsersResult.pageToken) {
    // List next batch of users.
    await listAllUsers(listUsersResult.pageToken, userCounts, extensionCounts);
  }
};

/**
 * Offboarding support for extension uninstalls.
 */
export const offboard = functions.https.onRequest(async (request, response) => {
  const attribution: { [key: string]: any; } = {};
  UTM_KEYS.forEach((key) => {
    const param = `utm_${key}`;
    if (request.query && param in request.query) {
      attribution[key] = request.query[param];
    }
  });

  functions.logger.info(`Offboard attribution received:`, {
    payload: attribution,
  });

  response.status(301).redirect(OFFBOARD_URL);
});

/**
 * Waitlist function, to collect user info for Sendgrid.
 */
export const waitlist = functions
  .runWith({ secrets: ["SENDGRID_API_KEY"] })
  .https.onRequest(async (request, response) => {
    if (request.method !== "POST") {
      response.status(500).send("Only POST and OPTIONS methods are allowed.");
      return;
    }

    functions.logger.debug(`Waitlist raw payload received`, {
      payload: request.body,
    });

    const userAgent = request.body.userAgent ?? "";

    const contact = {
      "email": request.body.email ?? "",
      "country": request.body.country ?? "",
      "platform": userAgent,
      "browser": userAgent,
      "utm_source": request.body.utm_source ?? "",
      "utm_medium": request.body.utm_medium ?? "",
      "utm_campaign": request.body.utm_campaign ?? "",
      "utm_term": request.body.utm_term ?? "",
      "utm_content": request.body.utm_content ?? "",
    };

    functions.logger.debug(`Waitlist parsed payload received`, {
      payload: JSON.stringify(contact),
    });


    try {
      Client.setApiKey(process.env.SENDGRID_API_KEY ?? "");
      const result = await Client.request({
        url: "/v3/contactdb/recipients",
        method: "POST",
        body: [JSON.stringify(contact)]
      });

      functions.logger.info("Sendgrid result", {
        payload: result[0].statusCode,
      });

      response.status(200).send({
        "category": "success",
        "message": "Email contact received.",
        "status": 200
      });

    } catch (ex) {
      functions.logger.error("Sendgrid failed", {
        payload: ex,
      });

      response.status(500).send({
        "category": "failure",
        "message": "Email contact not saved.",
        "status": 500
      });
    }
  });
