import { UserDocument } from "@mozilla/rally-shared-types/dist";
import {
  DocumentReference,
  Unsubscribe,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useAuthentication } from "./AuthenticationService";
import { useFirebase } from "./FirebaseService";

export interface UserDocumentDataContext {
  userDocument: UserDocument | null;
}

const UserDocumentContext = createContext<UserDocumentDataContext>(
  {} as UserDocumentDataContext
);

export function useUserDocument() {
  return useContext(UserDocumentContext);
}

export function UserDocumentProvider(props: { children: React.ReactNode }) {
  const [, setDocRef] = useState<DocumentReference>();
  const [userDocument, setUserDocument] = useState<UserDocument | null>(null);

  const { user } = useAuthentication();
  const { db } = useFirebase();
  const unsubscribeRef = useRef<Unsubscribe>(() => {});

  useEffect(() => {
    (async () => {
      const newRef = user ? doc(db, "users", user.firebaseUser.uid) : undefined;
      setDocRef(newRef);
      setUserDocument(await getUserDocument(newRef));

      unsubscribeRef.current();

      unsubscribeRef.current = newRef
        ? onSnapshot(newRef, (doc) =>
            setUserDocument(doc ? (doc.data() as UserDocument) : null)
          )
        : () => {};
    })();

    return () => unsubscribeRef.current();
  }, [user]);

  return (
    <UserDocumentContext.Provider value={{ userDocument }}>
      {props.children}
    </UserDocumentContext.Provider>
  );
}

async function getUserDocument(
  docRef?: DocumentReference
): Promise<UserDocument | null> {
  if (!docRef) {
    return null;
  }

  const doc = await getDoc(docRef);
  return doc.data() as UserDocument;
}
