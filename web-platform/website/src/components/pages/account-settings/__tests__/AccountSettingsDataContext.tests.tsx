import { render } from "@testing-library/react";
import { useEffect } from "react";

import {
  AccountSettingsDataContextProvider,
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "../AccountSettingsDataContext";

describe("AccountSettingsDataContext tests", () => {
  it("zero state", () => {
    let initalRender = false;

    function Component() {
      const { accountSettingsState } = useAccountSettingsDataContext();
      expect(accountSettingsState).toBe(AccountSettingsState.AccountSettings);

      initalRender = true;

      return null;
    }

    render(
      <AccountSettingsDataContextProvider>
        <Component />
      </AccountSettingsDataContextProvider>
    );

    expect(initalRender).toBeTruthy();
  });

  it("login state change", () => {
    let initialRender = false;
    let nextRender = false;

    function Component() {
      const { accountSettingsState, setAccountSettingsState } =
        useAccountSettingsDataContext();

      useEffect(() => {
        expect(accountSettingsState).toBe(AccountSettingsState.AccountSettings);
        setAccountSettingsState(AccountSettingsState.DeleteAccount);
        initialRender = true;
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      useEffect(() => {
        if (accountSettingsState === AccountSettingsState.DeleteAccount) {
          nextRender = true;
        }
      }, [accountSettingsState]);

      return null;
    }

    render(
      <AccountSettingsDataContextProvider>
        <Component />
      </AccountSettingsDataContextProvider>
    );

    expect(initialRender).toBeTruthy();
    expect(nextRender).toBeTruthy();
  });
});
