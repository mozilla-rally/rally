import type { NextPage } from "next";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { ProfilePageContent } from "../components/pages/profile/ProfilePageContent";
import { Strings } from "../resources/Strings";
import { ApplyFullscapePageStyles } from "../styles";

const strings = Strings.pages.profile;

const Profile: NextPage = () => {
  return (
    <AuthenticatedPage>
      <Head>
        <title>{strings.title}</title>
      </Head>

      <ProfilePageContent />
    </AuthenticatedPage>
  );
};

ApplyFullscapePageStyles();

export default Profile;
