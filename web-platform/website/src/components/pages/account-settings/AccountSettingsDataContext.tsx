import { createContext, useContext, useState } from "react";

export enum AccountSettingsState {
  AccountSettings = "AccountSettings",
  EditEmail = "EditEmail",
  EditPassword = "EditPassword",
  DeleteAccount = "DeleteAccount",
  ResetPassword = "ResetPassword",
}

export interface AccountSettingsDataContext {
  accountSettingsState: AccountSettingsState;
  setAccountSettingsState(accountSettingsState: AccountSettingsState): void;
}

const DataContext = createContext<AccountSettingsDataContext>({
  accountSettingsState: AccountSettingsState.AccountSettings,
} as AccountSettingsDataContext);

export function useAccountSettingsDataContext() {
  return useContext(DataContext);
}

export function AccountSettingsDataContextProvider(props: {
  children: React.ReactNode;
}) {
  const [accountSettingsState, setAccountSettingsState] =
    useState<AccountSettingsState>(AccountSettingsState.AccountSettings);

  return (
    <DataContext.Provider
      value={{
        accountSettingsState,
        setAccountSettingsState: (state) => setAccountSettingsState(state),
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}
