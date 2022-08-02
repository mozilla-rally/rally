import { render } from "@testing-library/react";

import {
  AccountSettingsDataContextProvider,
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "../AccountSettingsDataContext";
import { AccountSettingsNavigationBar } from "../AccountSettingsNavigationBar";
import { AccountSettingsPageContent } from "../AccountSettingsPageContent";
import { AccountSettingsView } from "../AccountSettingsView";

jest.mock("../AccountSettingsDataContext");
jest.mock("../AccountSettingsNavigationBar");
jest.mock("../AccountSettingsView");

describe("AccountSettingsPageContent tests", () => {
  beforeEach(() => {
    (AccountSettingsDataContextProvider as jest.Mock).mockImplementation(
      ({ children }) => children
    );
  });

  it("renders zero state", () => {
    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      accountSettingsState: AccountSettingsState.AccountSettings,
    });

    render(<AccountSettingsPageContent />);

    expect(AccountSettingsNavigationBar).toHaveBeenCalled();
    expect(AccountSettingsView).toHaveBeenCalled();
  });

  it("throws when state is invalid", () => {
    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      accountSettingsState: undefined,
    });

    jest.spyOn(console, "error").mockImplementation(() => {}); //eslint-disable-line @typescript-eslint/no-empty-function

    expect(() => render(<AccountSettingsPageContent />)).toThrowError(
      "Invalid account settings state."
    );
  });
});
