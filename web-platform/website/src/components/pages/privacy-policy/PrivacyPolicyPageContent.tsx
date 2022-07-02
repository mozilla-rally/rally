import { Container } from "reactstrap";

import { FullscapePageContainer } from "../../../styles/DocumentStyles";
import { PrivacyPolicyButtons } from "./PrivacyPolicyButtons";
import { PrivacyPolicyDataCollectionTypes } from "./PrivacyPolicyDataCollectionTypes";
import { PrivacyPolicyInformationUse } from "./PrivacyPolicyInformationUse";
import { PrivacyPolicyIntroduction } from "./PrivacyPolicyIntroduction";
import { PrivacyPolicyManageData } from "./PrivacyPolicyManageData";
import { PrivacyPolicySharing } from "./PrivacyPolicySharing";
import { PrivacyPolicyTitle } from "./PrivacyPolicyTitle";

export function PrivacyPolicyPageContent() {
  return (
    <Container className={`${FullscapePageContainer}`}>
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
