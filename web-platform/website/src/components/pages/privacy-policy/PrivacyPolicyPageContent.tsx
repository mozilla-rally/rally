import { Container } from "reactstrap";

import { FullscapePageContainer } from "../../../styles/DocumentStyles";
import { PrivacyPolicyButtons } from "./PrivacyPolicyButtons";
import { PrivacyPolicyDataCollectionTypes } from "./PrivacyPolicyDataCollectionTypes";
import { PrivacyPolicyHowDataIsUsed } from "./PrivacyPolicyHowDataIsUsed";
import { PrivacyPolicyInformationUse } from "./PrivacyPolicyInformationUse";
import { PrivacyPolicyIntroduction } from "./PrivacyPolicyIntroduction";
import { PrivacyPolicyManageData } from "./PrivacyPolicyManageData";
import { PrivacyPolicyReadyToRally } from "./PrivacyPolicyReadyToRally";
import { PrivacyPolicySharing } from "./PrivacyPolicySharing";
import { PrivacyPolicyTitle } from "./PrivacyPolicyTitle";
import { PrivacyPolicyYourContributions } from "./PrivacyPolicyYourContributions";

export function PrivacyPolicyPageContent(props: { readOnly: boolean }) {
  return (
    <Container
      className={`${FullscapePageContainer} ${props.readOnly ? "pt-5" : ""}`}
    >
      <PrivacyPolicyTitle />
      <PrivacyPolicyIntroduction />
      <PrivacyPolicyHowDataIsUsed />
      <PrivacyPolicyYourContributions />
      <PrivacyPolicyDataCollectionTypes />
      <PrivacyPolicyInformationUse />
      <PrivacyPolicySharing />
      <PrivacyPolicyManageData />
      <PrivacyPolicyReadyToRally />
      {props.readOnly ? null : <PrivacyPolicyButtons />}
    </Container>
  );
}
