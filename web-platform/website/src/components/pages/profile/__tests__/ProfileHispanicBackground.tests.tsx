import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { InputControl } from "../../../InputControl";
import { useProfileData } from "../ProfileDataContext";
import { ProfileHispanicBackground } from "../ProfileHispanicBackground";
import { StandardProfileSection } from "../StandardProfileSection";

jest.mock("../../../InputControl");
jest.mock("../ProfileDataContext");
jest.mock("../StandardProfileSection");

const strings = Strings.components.pages.profile.hispanic;

describe("ProfileHispanicBackground tests", () => {
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

    render(<ProfileHispanicBackground className="some-class" />);

    expect(document.querySelector(".some-class")).toBeInTheDocument();

    expect(StandardProfileSection).toHaveBeenCalledWith(
      {
        title: strings.title,
        onDataCleared: expect.anything(),
        isValuePresent: false,
        enableTwoColumnLayout: false,
        children: expect.anything(),
      },
      {}
    );

    strings.options.forEach(({ title }) => {
      expect(InputControl).toHaveBeenCalledWith(
        {
          title,
          name: "hispanic",
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
        hispanicLatinxSpanishOrigin: "hispanicLatinxSpanish",
      },
      setProfileData,
    });

    render(<ProfileHispanicBackground />);

    expect((InputControl as jest.Mock).mock.calls[1][0].checked).toBe(true);

    const arg = (StandardProfileSection as jest.Mock).mock.calls[0][0];
    arg.onDataCleared();

    expect(setProfileData).toHaveBeenCalledWith({ exactIncome: "10000" });
  });

  it("selecting an option updates the profile data when there is no profile data", () => {
    const setProfileData = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: undefined,
      setProfileData,
    });

    render(<ProfileHispanicBackground />);

    const inputControl = (InputControl as jest.Mock).mock.calls[1][0];

    inputControl.onChange();

    expect(setProfileData).toHaveBeenCalledWith({
      hispanicLatinxSpanishOrigin: "hispanicLatinxSpanish",
    });
  });

  it("selecting an age updates the profile data", () => {
    const setProfileData = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: {
        exactIncome: "10000",
        hispanicLatinxSpanishOrigin: "hispanicLatinxSpanish",
      },
      setProfileData,
    });

    render(<ProfileHispanicBackground />);

    const inputControl = (InputControl as jest.Mock).mock.calls[0][0];

    inputControl.onChange();

    expect(setProfileData).toHaveBeenCalledWith({
      exactIncome: "10000",
      hispanicLatinxSpanishOrigin: "other",
    });
  });
});
