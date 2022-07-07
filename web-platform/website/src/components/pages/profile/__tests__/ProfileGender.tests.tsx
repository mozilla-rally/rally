import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { InputControl } from "../../../InputControl";
import { useProfileData } from "../ProfileDataContext";
import { ProfileGender } from "../ProfileGender";
import { StandardProfileSection } from "../StandardProfileSection";

jest.mock("../../../InputControl");
jest.mock("../ProfileDataContext");
jest.mock("../StandardProfileSection");

const strings = Strings.components.pages.profile.gender;

describe("ProfileGender tests", () => {
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

    render(<ProfileGender className="some-class" />);

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

    strings.options.forEach(({ title }) => {
      expect(InputControl).toHaveBeenCalledWith(
        {
          title,
          name: "gender",
          checked: false,
          className: "me-3",
          type: "radio",
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
        gender: "male",
      },
      setProfileData,
    });

    render(<ProfileGender />);

    expect((InputControl as jest.Mock).mock.calls[0][0].checked).toBe(true);

    const arg = (StandardProfileSection as jest.Mock).mock.calls[0][0];
    arg.onDataCleared();

    expect(setProfileData).toHaveBeenCalledWith({ exactIncome: "10000" });
  });

  it("selecting a gender updates the profile data when there is no profile data", () => {
    const setProfileData = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: undefined,
      setProfileData,
    });

    render(<ProfileGender />);

    const inputControl = (InputControl as jest.Mock).mock.calls[1][0];

    inputControl.onChange();

    expect(setProfileData).toHaveBeenCalledWith({
      gender: "female",
    });
  });

  it("selecting a gender updates the profile data", () => {
    const setProfileData = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: {
        exactIncome: "10000",
        gender: "neither",
      },
      setProfileData,
    });

    render(<ProfileGender />);

    const inputControl = (InputControl as jest.Mock).mock.calls[0][0];

    inputControl.onChange();

    expect(setProfileData).toHaveBeenCalledWith({
      exactIncome: "10000",
      gender: "male",
    });
  });
});
