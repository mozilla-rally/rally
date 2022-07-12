import { UserDocument } from "@mozilla/rally-shared-types/dist";
import { RenderResult, render } from "@testing-library/react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
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
  };

  const userDoc = {
    id: "docId",
    data: () => userDocData,
  };

  const studiesDocData = [
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
  ];

  const studiesDocs = {
    id: "studies",
    docs: studiesDocData,
  };

  const onSnapshotFn = onSnapshot as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    (useAuthentication as jest.Mock).mockReturnValue({ user });

    (useFirebase as jest.Mock).mockReturnValue({ db });

    (doc as jest.Mock).mockReturnValue(docRef);

    (collection as jest.Mock).mockReturnValue(collRef);
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
    expect(isDocumentLoaded).toBeFalsy();
    expect(onSnapshotFn).not.toHaveBeenCalled();
  });

  it("authenticated state", async () => {
    let obtainedDoc = null;

    let isDocumentLoaded = false;
    let root: RenderResult = {} as RenderResult;
    let component: JSX.Element = {} as JSX.Element;

    const unsubscribe = jest.fn();

    onSnapshotFn.mockReturnValue(unsubscribe);

    await renderComponent(
      ({ userDocument, isDocumentLoaded: isLoaded }) => (
        (obtainedDoc = userDocument), (isDocumentLoaded = isLoaded)
      ),
      (result, element) => ((root = result), (component = element))
    );

    expect(unsubscribe).not.toHaveBeenCalled();

    await invokeOnSnapshotInstances();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useFirebase).toHaveBeenCalled();

    expect(doc).toHaveBeenCalledWith(db, "users", user.firebaseUser.uid);

    expect(obtainedDoc).toEqual(userDocData);

    expect(isDocumentLoaded).toBeTruthy();

    expect(unsubscribe).not.toHaveBeenCalled();

    await act(async () => root.unmount());

    expect(unsubscribe).toHaveBeenCalledTimes(2);
  });

  it("detection of null document (deletion case) sets the user document to null", async () => {
    let obtainedDoc = null;

    await renderComponent(
      ({ userDocument }) => (obtainedDoc = userDocument),
      () => {}
    );

    await act(async () => {
      onSnapshotFn.mock.calls[0][1]({ data: () => null });
      onSnapshotFn.mock.calls[1][1]({ docs: null });
    });

    expect(obtainedDoc).toBeNull();
  });

  it("null document and null studies", async () => {
    let obtainedDoc = null;

    await renderComponent(
      ({ userDocument }) => (obtainedDoc = userDocument),
      () => {}
    );

    await act(async () => {
      onSnapshotFn.mock.calls[0][1](null);
      onSnapshotFn.mock.calls[1][1](null);
    });

    expect(obtainedDoc).toBeNull();
  });

  it("null document and non-null studies", async () => {
    let obtainedDoc = null;

    await renderComponent(
      ({ userDocument }) => (obtainedDoc = userDocument),
      () => {}
    );

    await act(async () => {
      onSnapshotFn.mock.calls[0][1](null);
      onSnapshotFn.mock.calls[1][1](studiesDocs);
    });

    expect(obtainedDoc).toEqual({
      studies: { study1: { name: "study1" }, study2: { name: "study2" } },
    });
  });

  it("transition from authenticated to logged out state", async () => {
    let obtainedDoc = null;
    let root: RenderResult = {} as RenderResult;
    let component: JSX.Element = {} as JSX.Element;

    await renderComponent(
      ({ userDocument }) => (obtainedDoc = userDocument),
      (result, element) => ((root = result), (component = element))
    );

    await invokeOnSnapshotInstances();

    expect(obtainedDoc).toEqual(userDocData);

    (useAuthentication as jest.Mock).mockReturnValue({ user: undefined });

    await act(async () => {
      root.rerender(component);
    });

    expect(obtainedDoc).toEqual(userDocData);
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

    await invokeOnSnapshotInstances();

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

  async function invokeOnSnapshotInstances() {
    expect(onSnapshotFn).toHaveBeenCalledTimes(2);

    expect(onSnapshotFn).toHaveBeenCalledWith(docRef, expect.anything());
    expect(onSnapshotFn).toHaveBeenCalledWith(collRef, expect.anything());

    await act(async () => {
      onSnapshotFn.mock.calls[0][1](userDoc);
      onSnapshotFn.mock.calls[1][1](studiesDocs);
    });
  }
});
