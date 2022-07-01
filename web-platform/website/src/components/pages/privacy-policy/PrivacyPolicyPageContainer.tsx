import { useRouter } from "next/router";
import { Container } from "reactstrap";
import { cssRule, style } from "typestyle";

import { useUserDocument } from "../../../services/UserDocumentService";
import {
  Colors,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../../styles";
import { PrivacyPolicyButtons } from "./PrivacyPolicyButtons";
import { PrivacyPolicyDataCollectionTypes } from "./PrivacyPolicyDataCollectionTypes";
import { PrivacyPolicyInformationUse } from "./PrivacyPolicyInformationUse";
import { PrivacyPolicyIntroduction } from "./PrivacyPolicyIntroduction";
import { PrivacyPolicyManageData } from "./PrivacyPolicyManageData";
import { PrivacyPolicySharing } from "./PrivacyPolicySharing";
import { PrivacyPolicyTitle } from "./PrivacyPolicyTitle";

export function PrivacyPolicyPageContainer() {
  const { userDocument } = useUserDocument();
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  if (userDocument && userDocument.enrolled) {
    router.replace("/");
    return null;
  }

  return (
    <Container className={`${styles.container} m-auto`}>
      <PrivacyPolicyTitle />
      <PrivacyPolicyIntroduction />
      <PrivacyPolicyDataCollectionTypes />
      <PrivacyPolicyInformationUse />
      <PrivacyPolicySharing />
      <PrivacyPolicyManageData />
      <PrivacyPolicyButtons />
    </Container>
  );
}

cssRule("body", {
  background: `url("/img/noise-texture-top.png"), url("/img/noise-texture.png")`,
  backgroundBlendMode: "screen",
});

const styles = {
  container: style(
    createResponsiveStyle(ScreenSize.ExtraSmall, {
      width: "100%",
      paddingTop: 0,
    }),
    createResponsiveStyle(ScreenSize.Small, {
      width: "100%",
    }),
    createResponsiveStyle(ScreenSize.Medium, {
      width: "100%",
    }),
    {
      paddingTop: Spacing.xxxLarge * 2,
      paddingBottom: 200,
      width: "688px",
      $nest: {
        "h1, h2, h3, h4": {
          marginBottom: Spacing.xxLarge,
        },
        h1: {
          fontSize: "2.375rem",
        },
        h2: {
          fontSize: "1.5rem",
        },
        hr: {
          marginTop: Spacing.xLarge,
          marginBottom: Spacing.xLarge,
        },
        p: {
          color: Colors.ColorMarketingGray70,
          fontSmooth: "antialiased",
          marginBottom: 0,
        },
      },
    }
  ),
};
