import { RenderResult, act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Strings } from "../../../../resources/Strings";
import { useAuthentication } from "../../../../services/AuthenticationService";
import { getFirebaseErrorMessage } from "../../../../utils/FirebaseErrors";
import {
  LoginFormValidationResult,
  validateLoginForm,
} from "../../login/LoginFormValidator";
import {
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "../AccountSettingsDataContext";
import { EditAccountEmailView } from "../EditAccountEmailView";
import { EmailChangedView } from "../EmailChangedView";

jest.mock("../../../../services/AuthenticationService");
jest.mock("../../../../utils/FirebaseErrors");
jest.mock("../../login/LoginFormValidator");
jest.mock("../AccountSettingsDataContext");
jest.mock("../EmailChangedView");

const strings = Strings.components.pages.accountSettings.editEmailAccount;

describe("EditAccountEmailView tests", () => {
  it("zero state", () => {
    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState: undefined,
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      changeUserEmail: undefined,
    });

    const root = render(<EditAccountEmailView />);

    assertDefaultRender(root);
  });

  it("invalid email is detected as error", async () => {
    const invalidEmail = "abc";

    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState: undefined,
    });

    const changeUserEmail = jest.fn();
    (useAuthentication as jest.Mock).mockReturnValue({
      changeUserEmail,
    });

    const emailError = "Invalid email";
    (validateLoginForm as jest.Mock).mockReturnValue({
      email: {
        error: emailError,
      },
      valid: false,
    });

    userEvent.setup();

    const root = render(<EditAccountEmailView />);

    await setEmail(invalidEmail);

    root.debug();

    const button = root.getByText(strings.update) as HTMLElement;
    expect(button).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(getUpdateButton(root));
    });

    expect(changeUserEmail).not.toHaveBeenCalled();
  });

  function assertDefaultRender(root: RenderResult) {
    expect(root.getByText(strings.title)).toBeInTheDocument();

    expect(document.getElementById("email")).toBeInTheDocument();
  }

  async function setEmail(email: string) {
    const txtEmail = document.getElementById("email") as HTMLElement;
    expect(txtEmail).toBeInTheDocument();

    await userEvent.type(txtEmail, email);
  }

  function getUpdateButton(root: RenderResult) {
    const button = root.getByText(strings.update) as HTMLElement;
    expect(button).toBeInTheDocument();

    return button;
  }
});
