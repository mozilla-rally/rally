import { RenderResult, act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Strings } from "../../../../resources/Strings";
import { useAuthentication } from "../../../../services/AuthenticationService";
import {
  validatePasswordAccountForm,
  validatePasswordRules,
} from "../../login/LoginFormValidator";
import { PasswordRules } from "../../login/PasswordRules";
import { useAccountSettingsDataContext } from "../AccountSettingsDataContext";
import { EditAccountPasswordView } from "../EditAccountPasswordView";

jest.mock("../../../../services/AuthenticationService");
jest.mock("../../../../utils/FirebaseErrors");
jest.mock("../../login/LoginFormValidator");
jest.mock("../../login/PasswordRules");
jest.mock("../AccountSettingsDataContext");

const strings = Strings.components.pages.accountSettings.editPasswordAccount;

describe("EditAccountPasswordView tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState: undefined,
    });
    (PasswordRules as jest.Mock).mockImplementation(() => null);
    (useAuthentication as jest.Mock).mockReturnValue({
      changeUserPassword: undefined,
    });
    (validatePasswordRules as jest.Mock).mockReturnValue([]);
  });

  it("zero state", () => {
    const root = render(<EditAccountPasswordView />);

    assertDefaultRender(root);
  });

  it("invalid new password is detected as error", async () => {
    const invalidPassword = "password";

    const changeUserPassword = jest.fn();
    (useAuthentication as jest.Mock).mockReturnValue({
      changeUserPassword,
    });

    const passwordError = "Invalid new password";
    (validatePasswordAccountForm as jest.Mock).mockReturnValue({
      newPassword: { error: passwordError },
      validRules: false,
      valid: false,
    });

    userEvent.setup();

    const root = render(<EditAccountPasswordView />);

    await setPassword(invalidPassword);

    const button = root.getByText(strings.update) as HTMLElement;
    expect(button).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(getUpdateButton(root));
    });

    expect(changeUserPassword).not.toHaveBeenCalled();
  });

  function assertDefaultRender(root: RenderResult) {
    expect(root.getByText(strings.title)).toBeInTheDocument();

    expect(document.getElementById("newPassword")).toBeInTheDocument();
  }

  async function setPassword(password: string) {
    const txtPassword = document.getElementById("newPassword") as HTMLElement;
    expect(txtPassword).toBeInTheDocument();

    await userEvent.type(txtPassword, password);
  }

  function getUpdateButton(root: RenderResult) {
    const button = root.getByText(strings.update) as HTMLElement;
    expect(button).toBeInTheDocument();

    return button;
  }
});
