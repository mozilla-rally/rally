import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import { Strings } from "../../../../resources/Strings";
import {
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "../AccountSettingsDataContext";
import { DeleteAccountDisclaimer } from "../DeleteAccountDisclaimer";

jest.mock("../AccountSettingsDataContext");

const strings =
  Strings.components.pages.accountSettings.deleteAccountDisclaimer;

describe("DeleteAccountDisclaimer tests", () => {
  it("renders content correctly and issues deletion state when clicked", async () => {
    const setAccountSettingsState = jest.fn();

    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      setAccountSettingsState,
    });

    userEvent.setup();
    const root = render(<DeleteAccountDisclaimer />);

    expect(root.getByText(strings.title)).toBeInTheDocument();
    expect(root.getByText(strings.tagline)).toBeInTheDocument();

    const deleteLink = root.getByText(strings.delete);
    expect(deleteLink).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(deleteLink);
    });

    expect(setAccountSettingsState).toHaveBeenCalledWith(
      AccountSettingsState.DeleteAccount
    );
  });
});
