import { AccountSettingsMobileNavigationBar } from "./AccountSettingsMobileNavigationBar";
import { AccountSettingsNavigationBar } from "./AccountSettingsNavigationBar";

export function AccountSettingsNavigationBarWrapper() {
  return (
    <>
      <AccountSettingsMobileNavigationBar />
      <AccountSettingsNavigationBar />
    </>
  );
}
