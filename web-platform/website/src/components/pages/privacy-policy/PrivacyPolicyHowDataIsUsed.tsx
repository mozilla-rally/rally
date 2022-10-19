import { Strings } from "../../../resources/Strings";
import { StandardPrivacyPolicySection } from "./StandardPrivacyPolicySection";

const strings = Strings.components.pages.privacyPolicy.howDataIsUsed;

export function PrivacyPolicyHowDataIsUsed() {
  return <StandardPrivacyPolicySection {...strings} />;
}
