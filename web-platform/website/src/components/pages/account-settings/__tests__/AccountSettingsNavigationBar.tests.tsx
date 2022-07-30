import { RenderResult, act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Strings } from "../../../../resources/Strings";
import {
  UserType,
  useAuthentication,
} from "../../../../services/AuthenticationService";
import {
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "../AccountSettingsDataContext";
import { AccountSettingsNavigationBar } from "../AccountSettingsNavigationBar";

jest.mock("../../../../services/AuthenticationService");
jest.mock("../AccountSettingsDataContext");

const strings = Strings.components.pages.accountSettings.navigationBar;

describe("AccountSettingsNavigationBar tests", () => {
  const setAccountSettingsState = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("renders links for email logged in user", async () => {
    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      accountSettingsState: AccountSettingsState.AccountSettings,
      setAccountSettingsState,
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      userType: UserType.Email,
    });

    userEvent.setup();
    const root = render(<AccountSettingsNavigationBar />);

    for (const section of strings.sections) {
      await validateLink(root, section);

      for (const link of section.links || []) {
        await validateLink(root, link);
      }
    }
  });

  it("render links for google logged in user", async () => {
    (useAccountSettingsDataContext as jest.Mock).mockReturnValue({
      accountSettingsState: AccountSettingsState.AccountSettings,
      setAccountSettingsState,
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      userType: UserType.Google,
    });

    userEvent.setup();
    const root = render(<AccountSettingsNavigationBar />);

    for (const section of strings.sections) {
      await validateLink(root, section);

      for (const link of section.links || []) {
        if (link.accountType && link.accountType !== UserType.Google) {
          expect(root.queryByText(link.text)).not.toBeInTheDocument();
        } else {
          await validateLink(root, link);
        }
      }
    }
  });

  async function validateLink(
    root: RenderResult,
    section: {
      text: string;
      command?: string;
      external?: boolean;
      link?: string;
    }
  ) {
    const isCommand = !!section.command;

    const sectionElement = root.getByText(section.text);
    expect(sectionElement).toBeInTheDocument();

    if (isCommand) {
      setAccountSettingsState.mockReset();

      await act(async () => {
        await userEvent.click(sectionElement);
      });

      expect(setAccountSettingsState).toHaveBeenCalledWith(section.command);
    } else {
      const link = document.querySelector(
        `a[href="${section.link}"]`
      ) as HTMLAnchorElement;

      expect(link).toBeInTheDocument();
      expect(link.rel).toBe("noreferrer");
      expect(link.target).toBe(section.external ? "_blank" : "_self");
    }
  }
});
