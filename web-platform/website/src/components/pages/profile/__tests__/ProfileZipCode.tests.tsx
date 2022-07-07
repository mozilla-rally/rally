import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import { Strings } from "../../../../resources/Strings";
import { useProfileData } from "../ProfileDataContext";
import { ProfileZipCode } from "../ProfileZipCode";
import { StandardProfileSection } from "../StandardProfileSection";

jest.mock("../ProfileDataContext");
jest.mock("../StandardProfileSection");

const strings = Strings.components.pages.profile.zipCode;

describe("ProfileZipCode tests", () => {
  beforeEach(() => {
    (StandardProfileSection as jest.Mock).mockImplementation(
      ({ children }) => children
    );
  });

  it("zero state", () => {
    const setProfileData = jest.fn();
    const addValidator = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: undefined,
      setProfileData,
      addValidator,
    });

    const root = render(<ProfileZipCode className="some-class" />);

    expect(addValidator).toHaveBeenCalled();

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

    expect(document.querySelector("input")).toBeInTheDocument();
    expect(root.queryByText(strings.invalidZipCode)).not.toBeInTheDocument();
  });

  it("loads zip code correctly and clears it out", () => {
    const setProfileData = jest.fn();
    const addValidator = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: { age: "19_34", zipcode: 98052 },
      setProfileData,
      addValidator,
    });

    render(<ProfileZipCode className="some-class" />);

    const input = document.querySelector("input") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    expect(input.value).toBe("98052");

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

  it("zip code text box ignored non-numeric characters", async () => {
    const setProfileData = jest.fn();
    const addValidator = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: undefined,
      setProfileData,
      addValidator,
    });

    userEvent.setup();

    render(<ProfileZipCode className="some-class" />);

    const input = document.querySelector("input") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    await act(async () => {
      await userEvent.type(input, "1A2B3C");
    });

    expect(input.value).toBe("123");

    await userEvent.tab();

    await act(async () => {
      await userEvent.clear(input);
    });

    expect(input.value).toBe("");

    await userEvent.tab();
  });

  it("invalid zipcode displays the error", async () => {
    const setProfileData = jest.fn();
    const addValidator = jest.fn();

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: { zipcode: 123 },
      setProfileData,
      addValidator,
    });

    userEvent.setup();

    const root = render(<ProfileZipCode className="some-class" />);

    expect(addValidator).toHaveBeenCalled();

    await act(async () => {
      (addValidator as jest.Mock).mock.calls[0][0]();
    });

    const input = document.querySelector("input") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    // Focus in and out triggers validation
    await userEvent.click(input);
    await userEvent.tab();

    expect(root.queryByText(strings.invalidZipCode)).toBeInTheDocument();
  });
});
