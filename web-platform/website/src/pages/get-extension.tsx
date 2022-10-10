import type { NextPage } from "next";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { GetExtensionContent } from "../components/pages/get-extension/GetExtensionContent";
import { Flags } from "../resources/Flags";
import { Strings } from "../resources/Strings";
import { useFlagService } from "../services/FlagService";
import { ApplyFullscapePageStyles } from "../styles";

const strings = Strings.pages.login;

const GetExtensionPage: NextPage = () => {
  const { isFlagActive } = useFlagService();

  if (isFlagActive(Flags.onboardingV2)) {
    return (
      <AuthenticatedPage>
        <GetExtensionContent>
          <Head>
            <title>{strings.title}</title>
          </Head>
        </GetExtensionContent>
      </AuthenticatedPage>
    );
  } else return null;
};

ApplyFullscapePageStyles();

export default GetExtensionPage;
