import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Strings } from "../../../../resources/Strings";
import { InputControl } from "../../../InputControl";
import { useProfileData } from "../ProfileDataContext";
import { ProfileEthnicity } from "../ProfileEthnicity";
import { StandardProfileSection } from "../StandardProfileSection";

jest.mock("../../../InputControl");
jest.mock("../ProfileDataContext");
jest.mock("../StandardProfileSection");

const strings = Strings.components.pages.profile.ethnicity;

describe("ProfileEthnicity tests", () => {
  beforeEach(() => {
    (StandardProfileSection as jest.Mock).mockImplementation(
      ({ children }) => children
    );
  });

  it("zero state", () => {
    const setProfileData = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: undefined,
      setProfileData,
    });

    render(<ProfileEthnicity className="some-class" />);

    expect(document.querySelector(".some-class")).toBeInTheDocument();

    expect(StandardProfileSection).toHaveBeenCalledWith(
      {
        title: strings.title,
        onDataCleared: expect.anything(),
        isValuePresent: false,
        enableTwoColumnLayout: true,
        children: expect.anything(),
      },
      {}
    );

    strings.options.forEach(({ title, value }) => {
      expect(InputControl).toHaveBeenCalledWith(
        {
          title,
          name: "ethnicity",
          type: "checkbox",
          checked: false,
          className: "me-3",
          value,
          onChange: expect.anything(),
        },
        {}
      );
    });
  });

  it("clears the data correctly", () => {
    const setProfileData = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: {
        exactIncome: "10000",
        race: ["chinese", "japanese"],
      },
      setProfileData,
    });

    render(<ProfileEthnicity />);

    const arg = (StandardProfileSection as jest.Mock).mock.calls[0][0];
    arg.onDataCleared();

    expect(setProfileData).toHaveBeenCalledWith({ exactIncome: "10000" });
  });

  it("selecting an ethinicty updates the profile data when there is no profile data", () => {
    const setProfileData = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: undefined,
      setProfileData,
    });

    render(<ProfileEthnicity />);

    const inputControl = (InputControl as jest.Mock).mock.calls[1][0];

    inputControl.onChange({ target: { checked: true } });

    expect(setProfileData).toHaveBeenCalledWith({
      race: ["asian_indian"],
    });
  });

  it("selecting ethnicity updates the profile data", () => {
    const setProfileData = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: {
        exactIncome: "10000",
        race: ["american_indian_or_alaska_native"],
      },
      setProfileData,
    });

    render(<ProfileEthnicity />);

    const inputControl = (InputControl as jest.Mock).mock.calls[1][0];

    inputControl.onChange({ target: { checked: true } });

    expect(setProfileData).toHaveBeenCalledWith({
      exactIncome: "10000",
      race: ["american_indian_or_alaska_native", "asian_indian"],
    });
  });

  it("unchecking an ethnicity removes it from the profile", () => {
    const setProfileData = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: {
        exactIncome: "10000",
        race: ["american_indian_or_alaska_native", "asian_indian"],
      },
      setProfileData,
    });

    userEvent.setup();

    render(<ProfileEthnicity />);

    const inputControl = (InputControl as jest.Mock).mock.calls[1][0];

    inputControl.onChange({ target: { checked: false } });

    expect(setProfileData).toHaveBeenCalledWith({
      exactIncome: "10000",
      race: ["american_indian_or_alaska_native"],
    });
  });
});
