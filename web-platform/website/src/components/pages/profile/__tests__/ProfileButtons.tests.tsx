import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

import { Strings } from "../../../../resources/Strings";
import { useUserDocument } from "../../../../services/UserDocumentService";
import { ProfileButtons } from "../ProfileButtons";
import { useProfileData } from "../ProfileDataContext";

jest.mock("next/router");
jest.mock("../../../../services/UserDocumentService");
jest.mock("../ProfileDataContext");

const strings = Strings.components.pages.profile.buttons;

describe("ProfileButtons tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("zero state with invalid data", async () => {
    const updateUserDocument = jest.fn();

    (useUserDocument as jest.Mock).mockReturnValue({
      updateUserDocument,
      userDocument: undefined,
    });

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: undefined,
      isValid: false,
    });

    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    userEvent.setup();

    render(<ProfileButtons />);

    const buttons = document.querySelectorAll("button");

    expect(buttons.length).toBe(2);

    const saveButton = buttons[0];

    expect(saveButton.innerHTML).toBe(strings.saveChanges);
    expect(saveButton.classList.contains("disabled")).toBeTruthy();
    expect(saveButton.classList.contains("border-danger")).toBeTruthy();
    expect(saveButton.classList.contains("text-danger")).toBeTruthy();

    const cancelButton = buttons[1];
    expect(cancelButton.innerHTML).toBe(strings.cancel);

    expect(push).not.toHaveBeenCalled();

    await userEvent.click(cancelButton);

    expect(updateUserDocument).toHaveBeenCalledWith({
      onboared: true,
    });
  });

  it("zero state with valid data", async () => {
    const updateUserDocument = jest.fn();

    (useUserDocument as jest.Mock).mockReturnValue({
      updateUserDocument,
      userDocument: {},
    });

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: {},
      isValid: true,
    });

    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    userEvent.setup();

    render(<ProfileButtons />);

    const buttons = document.querySelectorAll("button");

    expect(buttons.length).toBe(2);

    const saveButton = buttons[0];

    expect(saveButton.innerHTML).toBe(strings.saveChanges);
    expect(saveButton.classList.contains("disabled")).toBeFalsy();
    expect(saveButton.classList.contains("border-danger")).toBeFalsy();
    expect(saveButton.classList.contains("text-danger")).toBeFalsy();

    const cancelButton = buttons[1];
    expect(cancelButton.innerHTML).toBe(strings.cancel);

    expect(push).not.toHaveBeenCalled();

    await userEvent.click(cancelButton);

    expect(updateUserDocument).toHaveBeenCalledWith({
      onboared: true,
    });
  });

  it("updates data upon save when user document does not exist", async () => {
    const updateUserDocument = jest.fn();

    (useUserDocument as jest.Mock).mockReturnValue({
      updateUserDocument,
      userDocument: undefined,
    });

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: { exactIncome: "10000" },
      isValid: true,
    });

    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<ProfileButtons />);

    const buttons = document.querySelectorAll("button");

    expect(buttons.length).toBe(2);

    const saveButton = buttons[0];

    await userEvent.click(saveButton);

    expect(updateUserDocument).toHaveBeenCalledWith({
      demographicsData: {
        exactIncome: "10000",
      },
      onboared: true,
    });
  });

  it("updates data upon save", async () => {
    const updateUserDocument = jest.fn();

    (useUserDocument as jest.Mock).mockReturnValue({
      updateUserDocument,
      userDocument: {},
    });

    (useProfileData as jest.Mock).mockReturnValue({
      profileData: { exactIncome: "10000" },
      isValid: true,
    });

    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<ProfileButtons />);

    const buttons = document.querySelectorAll("button");

    expect(buttons.length).toBe(2);

    const saveButton = buttons[0];

    await userEvent.click(saveButton);

    expect(updateUserDocument).toHaveBeenCalledWith({
      demographicsData: {
        exactIncome: "10000",
      },
      onboared: true,
    });
  });
});
