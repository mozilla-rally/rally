import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import {
  UserType,
  useAuthentication,
} from "../../../../services/AuthenticationService";
import { AccountSettingsView } from "../AccountSettingsView";
import { DeleteAccountDisclaimer } from "../DeleteAccountDisclaimer";
import { EmailAccountSettings } from "../EmailAccountSettings";
import { GoogleAccountSettings } from "../GoogleAccountSettings";

jest.mock("../../../../services/AuthenticationService");
jest.mock("../DeleteAccountDisclaimer");
jest.mock("../EmailAccountSettings");
jest.mock("../GoogleAccountSettings");

const strings = Strings.components.pages.accountSettings.accountSettings;

describe("AccountSettingsView tests", () => {
  it("renders google settings", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      userType: UserType.Google,
    });

    const root = render(<AccountSettingsView />);

    expect(root.getByText(strings.title)).toBeInTheDocument();
    expect(root.getByText(strings.tagline)).toBeInTheDocument();
    expect(GoogleAccountSettings).toHaveBeenCalled();
    expect(DeleteAccountDisclaimer).toHaveBeenCalled();
  });

  it("renders email settings", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      userType: UserType.Email,
    });

    const root = render(<AccountSettingsView />);

    expect(root.getByText(strings.title)).toBeInTheDocument();
    expect(root.getByText(strings.tagline)).toBeInTheDocument();
    expect(EmailAccountSettings).toHaveBeenCalled();
    expect(DeleteAccountDisclaimer).toHaveBeenCalled();
  });
});
