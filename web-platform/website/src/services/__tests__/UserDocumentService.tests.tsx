import { UserDocument } from "@mozilla/rally-shared-types/dist";
import { RenderResult, render } from "@testing-library/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { act } from "react-dom/test-utils";

import { useAuthentication } from "../AuthenticationService";
import { useFirebase } from "../FirebaseService";
import {
  UserDocumentDataContext,
  UserDocumentProvider,
  useUserDocument,
} from "../UserDocumentService";

jest.mock("firebase/firestore");
jest.mock("../AuthenticationService");
jest.mock("../FirebaseService");

describe("UserDocumentService tests", () => {
  const user = { firebaseUser: { uid: "userId" } };

  const db = { test: "db" };

  const docRef = { docId: "docId" };

  const collRef = { collectionId: "studies" };

  const userDocData = {
    rawData: "some data",
    studies: [
      {
        id: "study1",
        data: () => ({
          name: "study1",
        }),
      },
      {
        id: "study2",
        data: () => ({
          name: "study2",
        }),
      },
    ],
  };

  const userDoc = {
    docId: "docId",
    userId: "userId",
    data: () => userDocData,
  };

  beforeEach(() => {
    jest.resetAllMocks();

    (useAuthentication as jest.Mock).mockReturnValue({ user });

    (useFirebase as jest.Mock).mockReturnValue({ db });

    (doc as jest.Mock).mockReturnValue(docRef);

    (getDoc as jest.Mock).mockImplementation(() => userDoc);
  });

  it("zero state", async () => {
    (useAuthentication as jest.Mock).mockReturnValue({ user: undefined });

    let obtainedDoc = null;
    let isDocumentLoaded = false;

    await renderComponent(
      ({ userDocument, isDocumentLoaded: isLoaded }) => (
        (obtainedDoc = userDocument), (isDocumentLoaded = isLoaded)
      ),
      () => {}
    );

    expect(useAuthentication).toHaveBeenCalled();
    expect(useFirebase).toHaveBeenCalled();

    expect(doc).not.toHaveBeenCalled();
    expect(getDoc).not.toHaveBeenCalled();
    expect(obtainedDoc).toEqual(null);
    expect(isDocumentLoaded).toBeTruthy();
  });

  it("authenticated state", async () => {
    let obtainedDoc = null;
    let root: RenderResult | null = null;

    let isDocumentLoaded = false;

    await renderComponent(
      ({ userDocument, isDocumentLoaded: isLoaded }) => (
        (obtainedDoc = userDocument), (isDocumentLoaded = isLoaded)
      ),
      (result) => (root = result)
    );

    expect(useAuthentication).toHaveBeenCalled();
    expect(useFirebase).toHaveBeenCalled();

    expect(doc).toHaveBeenCalledWith(db, "users", user.firebaseUser.uid);

    expect(obtainedDoc).toEqual(userDocData);

    expect(isDocumentLoaded).toBeTruthy();
  });

  it("detection of null document (deletion case) sets the user document to null", async () => {
    let obtainedDoc = null;

    (getDoc as jest.Mock).mockImplementation(() => null);

    await renderComponent(
      ({ userDocument }) => (obtainedDoc = userDocument),
      () => {}
    );

    expect(obtainedDoc).toBeNull();
  });

  it("transition from authenticated to logged out state", async () => {
    let obtainedDoc = null;
    let root: RenderResult = {} as RenderResult;
    let component: JSX.Element = {} as JSX.Element;

    await renderComponent(
      ({ userDocument }) => (obtainedDoc = userDocument),
      (result, element) => ((root = result), (component = element))
    );

    expect(obtainedDoc).toEqual(userDocData);

    (useAuthentication as jest.Mock).mockReturnValue({ user: undefined });

    await act(async () => {
      root.rerender(component);
    });

    expect(obtainedDoc).toBeNull();
  });

  it("update user document invokes the correct firebase function", async () => {
    let updateUserDoc: (
      userDocument: UserDocument
    ) => Promise<void> = async () => {};
    let obtainedDoc = null;

    await renderComponent(
      ({ updateUserDocument, userDocument }) => (
        (updateUserDoc = updateUserDocument), (obtainedDoc = userDocument)
      ),
      () => {}
    );

    const newDocData = { newDocId: "newDocId" };

    await updateUserDoc({
      ...(obtainedDoc || {}),
      ...newDocData,
    } as unknown as UserDocument);

    expect(updateDoc).toHaveBeenCalledWith(docRef, {
      ...newDocData,
      ...userDocData,
    });
  });

  async function renderComponent(
    onDocumentChanged: (dataContext: UserDocumentDataContext) => void,
    onComponentRendered: (root: RenderResult, component: JSX.Element) => void
  ) {
    function Component() {
      const dataContext = useUserDocument();
      onDocumentChanged(dataContext);
      return null;
    }

    const renderedComponent = (
      <UserDocumentProvider>
        <Component />
      </UserDocumentProvider>
    );

    await act(async () => {
      const root = render(renderedComponent);

      onComponentRendered &&
        onComponentRendered(root, React.cloneElement(renderedComponent));
    });
  }
});
