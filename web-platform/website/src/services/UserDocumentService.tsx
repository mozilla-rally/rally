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
  updateUserDocument(userDocument: Partial<UserDocument>): Promise<void>;
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

  const { user, isLoaded } = useAuthentication();
  const { db } = useFirebase();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      setIsDocumentLoaded(true);
      return;
    }

    const newDocRefs = createUserRefs(db, user);

    return onUserDocumentChanges(newDocRefs, (userDoc) => {
      setUserDocument(userDoc);
      setIsDocumentLoaded(true);
    });
  }, [user]);

  return (
    <UserDocumentContext.Provider
      value={{
        isDocumentLoaded,
        userDocument,
        updateUserDocument: async (userDoc) => {
          await updateUserDocument(
            db,
            user?.firebaseUser.uid as string,
            userDoc
          );
        },
      }}
    >
      {props.children}
    </UserDocumentContext.Provider>
  );
}

function createUserRefs(db: Firestore, user: User) {
  return {
    userRef: doc(db, "users", user.firebaseUser.uid),
    userStudiesRef: collection(db, "users", user.firebaseUser.uid, "studies"),
  };
}

function onUserDocumentChanges(
  refs: UserDocumentsRef,
  onDocumentUpdated: (userDoc: UserDocument | null) => void
): Unsubscribe {
  let userDoc = null as UserDocument | null;

  const userUnsubscribe = onSnapshot(refs.userRef, (doc) => {
    userDoc = doc && (doc.data() as UserDocument);

    // Shallow spread is necessary so that React treats this as a new object
    // since it does not detect mutations within the same object
    onDocumentUpdated(userDoc ? { ...userDoc } : null);
  });

  const studiesUnsubscribe = onSnapshot(refs.userStudiesRef, (studiesDocs) => {
    if (!studiesDocs || !studiesDocs.docs) {
      return;
    }

    // Ensure that if studies are loaded before user document, then we don't invoke callback
    const isUserDocLoaded = !!userDoc;

    userDoc = userDoc || ({} as UserDocument);
    userDoc.studies = {};

    for (let record of studiesDocs.docs) {
      userDoc.studies[record.id] = record.data() as UserStudyRecord;
    }

    // Shallow spread is necessary so that React treats this as a new object
    // since it does not detect mutations within the same object
    isUserDocLoaded && onDocumentUpdated({ ...userDoc });
  });

  return () => {
    userUnsubscribe && userUnsubscribe();
    studiesUnsubscribe && studiesUnsubscribe();
  };
}

async function updateUserDocument(
  db: Firestore,
  firebaseUid: string,
  partialDocument: Partial<UserDocument>
): Promise<void> {
  assert(partialDocument, "Invalid user document.");

  if (partialDocument.studies) {
    for (const studyId in partialDocument.studies) {
      const studyRef = doc(db, "users", firebaseUid, "studies", studyId);
      await setDoc(studyRef, partialDocument.studies[studyId], { merge: true });
    }
  }

  const userDocRef = doc(db, "users", firebaseUid);
  await setDoc(userDocRef, partialDocument as {}, { merge: true });
}
