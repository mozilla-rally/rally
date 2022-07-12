import { UserDocument } from "@mozilla/rally-shared-types/dist";
import assert from "assert";
import { Firestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

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

export function UserDocumentProvider(props: { children: React.ReactNode }) {
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [userDocument, setUserDocument] = useState<UserDocument | null>(null);

  const { user } = useAuthentication();
  const { db } = useFirebase();

  useEffect(() => {
    (async () => {
      setUserDocument(
        await getUserDocument(db, user?.firebaseUser.uid as string)
      );
      setIsDocumentLoaded(true);
    })();
  }, [user]);

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

async function getUserDocument(
  db: Firestore,
  firebaseUid: string
): Promise<UserDocument | null> {
  if (!firebaseUid) {
    return null;
  }

  const userDocRef = doc(db, "users", firebaseUid);

  const rawUserDoc = await getDoc(userDocRef);

  if (!rawUserDoc) {
    return null;
  }

  return rawUserDoc.data() as UserDocument | null;
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
