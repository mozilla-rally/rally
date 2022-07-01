import { Strings } from "../../../resources/Strings";
import { StandardPrivacyPolicySection } from "./StandardPrivacyPolicySection";

const strings = Strings.components.pages.privacyPolicy.informationUse;
export function PrivacyPolicyInformationUse() {
  return <StandardPrivacyPolicySection {...strings} />;
}
