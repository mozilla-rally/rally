import {
  UserDemographicsData,
  UserDocument,
} from "@mozilla/rally-shared-types";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { useUserDocument } from "../../../../services/UserDocumentService";
import {
  ProfileDataContext,
  ProfileDataProvider,
  useProfileData,
} from "../ProfileDataContext";

jest.mock("../../../../services/UserDocumentService");

describe("ProfileDataContext tests", () => {
  it("renders null when user document has not loaded yet", async () => {
    let context = undefined as unknown as ProfileDataContext;

    await act(async () => {
      renderComponent(
        undefined as unknown as UserDocument,
        false,
        (contextObj) => (context = contextObj)
      );
    });

    expect(context).toBeUndefined();
  });

  it("zero state no initial data", async () => {
    let context = {} as ProfileDataContext;

    await act(async () => {
      renderComponent(
        undefined as unknown as UserDocument,
        true,
        (contextObj) => (context = contextObj)
      );
    });

    expect(context.profileData).toBeDefined();
    expect(context.isValid).toBeTruthy();
    expect(context.addValidator).toBeDefined();
    expect(context.setProfileData).toBeDefined();
  });

  it("zero state", async () => {
    const userDocument = { demographicsData: { age: "19_24" } } as UserDocument;
    let context = {} as ProfileDataContext;

    await act(async () => {
      renderComponent(
        userDocument,
        true,
        (contextObj) => (context = contextObj)
      );
    });

    expect(context.profileData).toBe(userDocument.demographicsData);
    expect(context.isValid).toBeTruthy();
    expect(context.addValidator).toBeDefined();
    expect(context.setProfileData).toBeDefined();
  });

  it("addValidator adds validator and validates the data", async () => {
    const userDocument = { demographicsData: { age: "19_24" } } as UserDocument;
    let context = {} as ProfileDataContext;

    await act(async () => {
      renderComponent(
        userDocument,
        true,
        (contextObj) => (context = contextObj)
      );
    });

    expect(context.isValid).toBeTruthy();

    const trueValidator = jest.fn().mockReturnValue(true);
    const falseValidator = jest.fn().mockReturnValue(false);

    let falseValidatorUnsubscribe = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
    await act(async () => {
      falseValidatorUnsubscribe = context.addValidator(falseValidator);
      context.addValidator(trueValidator);
    });

    expect(falseValidator).toHaveBeenCalled();
    expect(context.isValid).toBeFalsy();

    // Ensure unsubscribing again makes the data valid
    falseValidator.mockReset();

    await act(async () => {
      falseValidatorUnsubscribe();
    });

    expect(falseValidator).not.toHaveBeenCalled();
    expect(context.isValid).toBeTruthy();
  });

  it("setProfileData updates the state", async () => {
    const userDocument = { demographicsData: { age: "19_24" } } as UserDocument;

    let context = {} as ProfileDataContext;

    await act(async () => {
      renderComponent(
        userDocument,
        true,
        (contextObj) => (context = contextObj)
      );
    });

    const newData = { age: "25_34" } as UserDemographicsData;

    await act(async () => {
      context.setProfileData(newData);
    });

    expect(context.profileData).toBe(newData);
  });

  async function renderComponent(
    userDocument: UserDocument,
    isDocumentLoaded: boolean,
    onContext: (context: ProfileDataContext) => void
  ) {
    (useUserDocument as jest.Mock).mockReturnValue({
      isDocumentLoaded,
      userDocument,
    });

    function Component() {
      const dataContext = useProfileData();
      onContext(dataContext);
      return null;
    }

    const renderedComponent = (
      <ProfileDataProvider>
        <Component />
      </ProfileDataProvider>
    );

    await act(async () => {
      render(renderedComponent);
    });
  }
});
