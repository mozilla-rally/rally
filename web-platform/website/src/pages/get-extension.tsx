import type { NextPage } from "next";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { GetExtensionContent } from "../components/pages/get-extension/GetExtensionContent";
import { Strings } from "../resources/Strings";
import { ApplyFullscapePageStyles } from "../styles";

const strings = Strings.pages.getExtension;

const GetExtensionPage: NextPage = () => {
  return (
    <AuthenticatedPage>
      <GetExtensionContent>
        <Head>
          <title>{strings.title}</title>
        </Head>
      </GetExtensionContent>
    </AuthenticatedPage>
  );
};

ApplyFullscapePageStyles();

export default GetExtensionPage;
