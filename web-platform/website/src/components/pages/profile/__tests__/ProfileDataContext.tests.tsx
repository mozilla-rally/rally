import { UserDemographicsData } from "@mozilla/rally-shared-types";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import {
  ProfileDataContext,
  ProfileDataProvider,
  useProfileData,
} from "../ProfileDataContext";

describe("ProfileDataContext tests", () => {
  it("zero state no initial data", async () => {
    let context = {} as ProfileDataContext;

    await act(async () => {
      renderComponent(
        undefined as unknown as UserDemographicsData,
        (contextObj) => (context = contextObj)
      );
    });

    expect(context.profileData).toBeDefined();
    expect(context.isValid).toBeTruthy();
    expect(context.addValidator).toBeDefined();
    expect(context.setProfileData).toBeDefined();
  });

  it("zero state", async () => {
    const initialData = { age: "19_24" } as UserDemographicsData;
    let context = {} as ProfileDataContext;

    await act(async () => {
      renderComponent(initialData, (contextObj) => (context = contextObj));
    });

    expect(context.profileData).toBe(initialData);
    expect(context.isValid).toBeTruthy();
    expect(context.addValidator).toBeDefined();
    expect(context.setProfileData).toBeDefined();
  });

  it("addValidator adds validator and validates the data", async () => {
    const initialData = { age: "19_24" } as UserDemographicsData;
    let context = {} as ProfileDataContext;

    await act(async () => {
      renderComponent(initialData, (contextObj) => (context = contextObj));
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
    const initialData = { age: "19_24" } as UserDemographicsData;
    let context = {} as ProfileDataContext;

    await act(async () => {
      renderComponent(initialData, (contextObj) => (context = contextObj));
    });

    const newData = { age: "25_34" } as UserDemographicsData;

    await act(async () => {
      context.setProfileData(newData);
    });

    expect(context.profileData).toBe(newData);
  });

  function renderComponent(
    initialData: UserDemographicsData,
    onContext: (context: ProfileDataContext) => void
  ) {
    render(
      <ProfileDataProvider initialProfileData={initialData}>
        <Component onContext={onContext} />
      </ProfileDataProvider>
    );
  }

  function Component(props: {
    onContext: (context: ProfileDataContext) => void;
  }) {
    const profileData = useProfileData();
    props.onContext(profileData);
    return <span>Child Element</span>;
  }
});
