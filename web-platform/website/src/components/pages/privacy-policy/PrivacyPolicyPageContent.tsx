import { Container } from "reactstrap";
import { style } from "typestyle";
import { NestedCSSProperties } from "typestyle/lib/types";

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

export function PrivacyPolicyPageContent() {
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

const smallerStyle: NestedCSSProperties = {
  width: "100%",
  paddingTop: Spacing.xxxLarge,
  paddingLeft: Spacing.xxLarge,
  paddingRight: Spacing.xxLarge,
};

const styles = {
  container: style(
    createResponsiveStyle(ScreenSize.ExtraSmall, smallerStyle),
    createResponsiveStyle(ScreenSize.Small, smallerStyle),
    createResponsiveStyle(ScreenSize.Medium, smallerStyle),
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
