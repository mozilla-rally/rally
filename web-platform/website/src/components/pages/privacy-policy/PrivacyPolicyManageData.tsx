import { Strings } from "../../../resources/Strings";
import { StandardPrivacyPolicySection } from "./StandardPrivacyPolicySection";

const strings = Strings.components.pages.privacyPolicy.manageData;

export function PrivacyPolicyManageData() {
  return <StandardPrivacyPolicySection {...strings} />;
}
