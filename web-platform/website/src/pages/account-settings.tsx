import type { NextPage } from "next";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { AccountSettingsPageContent } from "../components/pages/account-settings/AccountSettingsPageContent";
import { Strings } from "../resources/Strings";

const strings = Strings.pages.accountSettings;

const AccountSettingsPage: NextPage = () => {
  return (
    <AuthenticatedPage>
      <Head>
        <title>{strings.title}</title>
      </Head>

      <AccountSettingsPageContent />
    </AuthenticatedPage>
  );
};

export default AccountSettingsPage;
