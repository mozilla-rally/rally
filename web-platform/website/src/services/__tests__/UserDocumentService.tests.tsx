import { RenderResult, render } from "@testing-library/react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React from "react";
import { act } from "react-dom/test-utils";

import { useAuthentication } from "../AuthenticationService";
import { useFirebase } from "../FirebaseService";
import { UserDocumentProvider, useUserDocument } from "../UserDocumentService";

jest.mock("firebase/firestore");
jest.mock("../AuthenticationService");
jest.mock("../FirebaseService");

describe("UserDocumentService tests", () => {
  const user = { firebaseUser: { uid: "userId" } };
  const db = { test: "db" };
  const docRef = { docId: "docId" };
  const userDoc = {
    docId: "docId",
    userId: "userId",
    data: () => ({
      rawData: "some data",
    }),
  };
  const unsubscribe = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (useAuthentication as jest.Mock).mockReturnValue({ user });

    (useFirebase as jest.Mock).mockReturnValue({ db });

    (doc as jest.Mock).mockReturnValue(docRef);

    (getDoc as jest.Mock).mockImplementation(() => userDoc);

    (onSnapshot as jest.Mock).mockReturnValue(unsubscribe);
  });

  it("zero state", async () => {
    (useAuthentication as jest.Mock).mockReturnValue({ user: undefined });

    let obtainedDoc = null;
    let root: RenderResult | null = null;

    await renderComponent(
      (doc) => (obtainedDoc = doc),
      (result) => (root = result)
    );

    expect(useAuthentication).toHaveBeenCalled();
    expect(useFirebase).toHaveBeenCalled();

    expect(doc).not.toHaveBeenCalled();
    expect(getDoc).not.toHaveBeenCalled();
    expect(obtainedDoc).toEqual(null);

    expect(unsubscribe).not.toHaveBeenCalled();
  });

  it("authenticated state", async () => {
    let obtainedDoc = null;
    let root: RenderResult | null = null;

    await renderComponent(
      (doc) => (obtainedDoc = doc),
      (result) => (root = result)
    );

    expect(useAuthentication).toHaveBeenCalled();
    expect(useFirebase).toHaveBeenCalled();

    expect(doc).toHaveBeenCalledWith(db, "users", user.firebaseUser.uid);
    expect(getDoc).toHaveBeenCalledWith(docRef);
    expect(obtainedDoc).toEqual(userDoc.data());

    expect(onSnapshot).toHaveBeenCalled();

    const call = (onSnapshot as jest.Mock).mock.calls[0];
    expect(call[0]).toBe(docRef);

    const newDocData = { newDocId: "newDocId" };
    const newDoc = {
      data: () => newDocData,
    };

    await act(async () => {
      await call[1](newDoc);
    });

    expect(obtainedDoc).toBe(newDocData);

    expect(unsubscribe).not.toHaveBeenCalled();

    await act(async () => {
      (root as unknown as RenderResult).unmount();
    });

    expect(unsubscribe).toHaveBeenCalled();
  });

  it("transition from authenticated to logged out state", async () => {
    let obtainedDoc = null;
    let root: RenderResult = {} as RenderResult;
    let component: JSX.Element = {} as JSX.Element;

    await renderComponent(
      (doc) => (obtainedDoc = doc),
      (result, element) => ((root = result), (component = element))
    );

    expect(obtainedDoc).toEqual(userDoc.data());

    (useAuthentication as jest.Mock).mockReturnValue({ user: undefined });

    await act(async () => {
      root.rerender(component);
    });

    expect(obtainedDoc).toBeNull();
  });

  it("detection of null document (deletion case) sets the user document to null", async () => {
    let obtainedDoc = null;

    await renderComponent(
      (doc) => (obtainedDoc = doc),
      () => {}
    );

    expect(obtainedDoc).toEqual(userDoc.data());

    const call = (onSnapshot as jest.Mock).mock.calls[0];
    expect(call[0]).toBe(docRef);

    await act(async () => {
      await call[1](null);
    });

    expect(obtainedDoc).toBeNull();
  });

  async function renderComponent(
    onDocumentChanged: (doc: any) => void,
    onComponentRendered: (root: RenderResult, component: JSX.Element) => void
  ) {
    function Component() {
      const { userDocument } = useUserDocument();
      onDocumentChanged(userDocument);
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
