import { Strings } from "../../../resources/Strings";
import { StandardPrivacyPolicySection } from "./StandardPrivacyPolicySection";

const strings = Strings.components.pages.privacyPolicy.introduction;

export function PrivacyPolicyIntroduction() {
  return <StandardPrivacyPolicySection {...strings} />;
}
