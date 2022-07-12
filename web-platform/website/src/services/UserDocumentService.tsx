import {
  UserDocument,
  UserStudyRecord,
} from "@mozilla/rally-shared-types/dist";
import assert from "assert";
import { Unsubscribe } from "firebase/auth";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

import { User } from "../models/User";
import { useAuthentication } from "./AuthenticationService";
import { useFirebase } from "./FirebaseService";

export interface UserDocumentDataContext {
  isDocumentLoaded: boolean;
  userDocument: UserDocument | null;
  updateUserDocument(userDocument: UserDocument): Promise<void>;
}

const UserDocumentContext = createContext<UserDocumentDataContext>(
  {} as UserDocumentDataContext
);

export function useUserDocument() {
  return useContext(UserDocumentContext);
}

interface UserDocumentsRef {
  userRef: DocumentReference<DocumentData>;
  userStudiesRef: CollectionReference<DocumentData>;
}

export function UserDocumentProvider(props: { children: React.ReactNode }) {
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [userDocument, setUserDocument] = useState<UserDocument | null>(null);

  const { user } = useAuthentication();
  const { db } = useFirebase();

  const [docRefs, setDocRefs] = useState<UserDocumentsRef | null>(null);

  useEffect(() => {
    setDocRefs(createUserRefs(db, user));
  }, [user]);

  useEffect(() => {
    return onUserDocumentChanges(docRefs, (userDoc) => {
      setUserDocument(userDoc);
      setIsDocumentLoaded(true);
    });
  }, [docRefs]);

  return (
    <UserDocumentContext.Provider
      value={{
        isDocumentLoaded,
        userDocument,
        updateUserDocument: (userDoc) =>
          updateUserDocument(db, user?.firebaseUser.uid as string, {
            ...(userDocument as UserDocument),
            ...userDoc,
          }),
      }}
    >
      {props.children}
    </UserDocumentContext.Provider>
  );
}

function createUserRefs(db: Firestore, user?: User) {
  return user
    ? {
        userRef: doc(db, "users", user.firebaseUser.uid),
        userStudiesRef: collection(
          db,
          "users",
          user.firebaseUser.uid,
          "studies"
        ),
      }
    : null;
}

function onUserDocumentChanges(
  refs: UserDocumentsRef | null,
  onDocumentUpdated: (userDoc: UserDocument) => void
): Unsubscribe {
  if (!refs) {
    return () => {};
  }

  let userDoc = null as UserDocument | null;

  const userUnsubscribe = onSnapshot(refs.userRef, (doc) => {
    userDoc = doc && (doc.data() as UserDocument);
  });

  const studiesUnsubscribe = onSnapshot(refs.userStudiesRef, (studiesDocs) => {
    if (!studiesDocs || !studiesDocs.docs) {
      return;
    }

    userDoc = userDoc || ({} as UserDocument);
    userDoc.studies = {};

    for (let record of studiesDocs.docs) {
      userDoc.studies[record.id] = record.data() as UserStudyRecord;
    }

    // Shallow spread is necessary so that React treats this as a new object
    // since it does not detect mutations within the same object
    onDocumentUpdated({ ...userDoc });
  });

  return () => {
    userUnsubscribe && userUnsubscribe();
    studiesUnsubscribe && studiesUnsubscribe();
  };
}

async function updateUserDocument(
  db: Firestore,
  firebaseUid: string,
  userDocument: UserDocument
): Promise<void> {
  assert(userDocument, "Invalid user document.");

  if (userDocument.studies) {
    for (const studyId in userDocument.studies) {
      const studyRef = doc(db, "users", firebaseUid, "studies", studyId);
      await setDoc(studyRef, userDocument.studies[studyId]);
    }
  }

  const userDocRef = doc(db, "users", firebaseUid);
  await updateDoc(userDocRef, userDocument as {});
}
