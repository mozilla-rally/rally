import { jest } from "@jest/globals";

import admin from "firebase-admin";
import functions from "firebase-functions";
import {
  addRallyUserToFirestoreImpl,
  deleteRallyUserImpl,
  loadFirestore,
  rallytoken,
} from "../index";
import { studies } from "../studies";
import fetch from "node-fetch";

async function disableFunctionTriggers() {
  await fetch(
    "http://" +
      process.env.FIREBASE_EMULATOR_HUB +
      "/functions/disableBackgroundTriggers",
    {
      method: "PUT",
    }
  );
}

async function enableFunctionTriggers() {
  await fetch(
    "http://" +
      process.env.FIREBASE_EMULATOR_HUB +
      "/functions/enableBackgroundTriggers",
    {
      method: "PUT",
    }
  );
}

beforeAll(async () => {
  await disableFunctionTriggers();
});

afterAll(async () => {
  await enableFunctionTriggers();
});

describe("loadFirestore", () => {
  const studyName = Object.keys(studies)[0];

  async function deleteStudy() {
    const studyRef = admin.firestore().collection("studies").doc(studyName);
    await studyRef.delete();
  }

  beforeEach(async () => {
    await deleteStudy();
  });

  afterEach(async () => {
    await deleteStudy();
  });

  it("loads data correctly from test user study", async () => {
    await loadFirestore(
      {} as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      { status: () => ({ send: () => {} }) } as any // eslint-disable-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-empty-function
    );

    const studyRef = admin.firestore().collection("studies");

    const userStudyDocs = await studyRef.get();

    expect(userStudyDocs.docs.length).toBe(1);

    expect(userStudyDocs.docs[0].data()).toEqual(studies.exampleStudy1);
  });
});

describe("addRallyUserToFirestore and deleteRallyUserImpl", () => {
  const user: admin.auth.UserRecord = {
    uid: "abc123",
  } as admin.auth.UserRecord;

  async function getUserRecords() {
    const userRef = admin.firestore().collection("users").doc(user.uid);
    const extensionRef = admin
      .firestore()
      .collection("extensionUsers")
      .doc(user.uid);

    return {
      user: await userRef.get(),
      extensionUser: await extensionRef.get(),
    };
  }

  async function deleteUserRecord() {
    const userRef = admin.firestore().collection("users").doc(user.uid);
    await userRef.delete();

    const extensionRef = admin
      .firestore()
      .collection("extensionUsers")
      .doc(user.uid);
    await extensionRef.delete();
  }

  beforeEach(async () => {
    await deleteUserRecord();
  });

  afterEach(async () => {
    await deleteUserRecord();
  });

  it("empty provider data does not register extension users", async () => {
    await expect(
      addRallyUserToFirestoreImpl({ ...user, providerData: [] })
    ).resolves.toBeFalsy();

    const userRecords = await getUserRecords();

    expect(userRecords.user.exists).toBeFalsy();
    expect(userRecords.extensionUser.exists).toBeFalsy();
  });

  async function createAndValidateUserRecords() {
    await expect(
      addRallyUserToFirestoreImpl({
        ...user,
        providerData: [{ uid: user.uid } as admin.auth.UserInfo],
      })
    ).resolves.toBeTruthy();

    const userRecords = await getUserRecords();

    expect(userRecords.user.exists).toBeTruthy();
    expect(userRecords.extensionUser.exists).toBeTruthy();

    const extensionData = userRecords.extensionUser.data() as FirebaseFirestore.DocumentData;
    expect(extensionData.rallyId).toBeDefined();
  }

  async function createStudiesForUser() {
    const userStudies = admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("studies");

    ["study-A", "study-B"].forEach((studyName) => {
      const study = userStudies.doc(studyName);

      for (let i = 0; i < 6; i++) {
        study.set({ [`studyName-${i}`]: "test" });
      }
    });
  }

  it("valid user is registered correctly", async () => {
    await createAndValidateUserRecords();
  });

  it("deletion deletes user and extensionUser", async () => {
    await createAndValidateUserRecords();
    await createStudiesForUser();
    await deleteRallyUserImpl(user);

    const userRecords = await getUserRecords();

    expect(userRecords.user.exists).toBeFalsy();
  });
});

describe("rallytoken tests", () => {
  let send: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let response: functions.Response<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  // Set up callbacks inside response.status.send
  function doAfterResponseSend(validateFn: () => void, doneFn: () => void) {
    send = jest.fn().mockImplementation(() => {
      validateFn(); // Jest assertions
      doneFn(); // Complete unit test
    });

    response = ({
      set: jest.fn(),
      status: jest.fn().mockReturnValue({ send }),
    } as unknown) as functions.Response<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  const uid = "fake-uid";
  const customToken = "fake-custom-token";

  const fakeAuth = {
    verifyIdToken: jest.fn(),
    createCustomToken: jest.fn(),
  };

  Object.defineProperty(admin, "auth", {
    get: function () {
      return () => fakeAuth;
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();

    fakeAuth.verifyIdToken.mockReturnValue({ uid });
    fakeAuth.createCustomToken.mockReturnValue(customToken);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fails for invalid http verb", (done) => {
    doAfterResponseSend(() => {
      expect(response.status).toHaveBeenCalledWith(500);
      expect(send).toHaveBeenCalledWith(
        "Only POST and OPTIONS methods are allowed."
      );
    }, done);

    rallytoken(
      {
        method: "PUT",
        headers: {
          authorization: "Bearer 123",
        },
      } as functions.Request<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
      response
    );
  });

  it("fails when POST is invoked with invalid payload", (done) => {
    doAfterResponseSend(() => {
      expect(response.status).toHaveBeenCalledWith(500);
      expect(send).toHaveBeenCalled();
    }, done);

    rallytoken(
      {
        method: "POST",
        headers: {
          authorization: "Bearer 123",
        },
      } as functions.Request<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
      response
    );
  });

  const idToken = "idToken";
  const studyId = "study1";
  const successValidateFn = () => {
    expect(response.status).toHaveBeenCalledWith(200);

    expect(fakeAuth.verifyIdToken).toHaveBeenCalledWith(idToken);
    expect(fakeAuth.createCustomToken).toHaveBeenCalledWith(
      `${studyId}:${uid}`,
      {
        firebaseUid: uid,
        studyId,
      }
    );

    expect(send.mock.calls[0][0]).toEqual({ rallyToken: customToken });
  };

  it("handles payload string in POST request", (done) => {
    doAfterResponseSend(successValidateFn, done);
    rallytoken(
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ idToken, studyId }),
      } as functions.Request<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
      response
    );
  });

  it("handles payload JSON in POST request", (done) => {
    doAfterResponseSend(successValidateFn, done);
    rallytoken(
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${idToken}`,
        },
        body: { idToken, studyId },
      } as functions.Request<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
      response
    );
  });
});
