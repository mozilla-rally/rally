import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import { Strings } from "../../../../resources/Strings";
import { useProfileData } from "../ProfileDataContext";
import { ProfileIncome } from "../ProfileIncome";
import { StandardProfileSection } from "../StandardProfileSection";

jest.mock("../ProfileDataContext");
jest.mock("../StandardProfileSection");

const strings = Strings.components.pages.profile.income;

describe("ProfileIncome tests", () => {
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

    const root = render(<ProfileIncome className="some-class" />);

    expect(document.querySelector(".some-class")).toBeInTheDocument();

    expect(root.getByText(strings.tagline)).toBeInTheDocument();

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

    expect(document.querySelector("input")).toBeInTheDocument();
  });

  it("loads income correctly and clears it out", () => {
    const setProfileData = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: { age: "19_34", exactIncome: 10000 },
      setProfileData,
    });

    render(<ProfileIncome className="some-class" />);

    const input = document.querySelector("input") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    expect(input.value).toBe("$10,000");

    expect(StandardProfileSection).toHaveBeenCalledWith(
      {
        title: strings.title,
        onDataCleared: expect.anything(),
        isValuePresent: true,
        enableTwoColumnLayout: false,
        children: expect.anything(),
      },
      {}
    );

    const arg = (StandardProfileSection as jest.Mock).mock.calls[0][0];
    arg.onDataCleared();

    expect(setProfileData).toHaveBeenCalledWith({ age: "19_34" });
  });

  it("income text box ignored non-numeric characters", async () => {
    const setProfileData = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: undefined,
      setProfileData,
    });

    userEvent.setup();

    render(<ProfileIncome className="some-class" />);

    const input = document.querySelector("input") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    await act(async () => {
      await userEvent.type(input, "1A2B3C");
    });

    expect(input.value).toBe("123");

    await act(async () => {
      await userEvent.clear(input);
    });

    expect(input.value).toBe("");
  });
});
