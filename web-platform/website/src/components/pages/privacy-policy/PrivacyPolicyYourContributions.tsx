import { Strings } from "../../../resources/Strings";
import { StandardPrivacyPolicySection } from "./StandardPrivacyPolicySection";

const strings = Strings.components.pages.privacyPolicy.yourContributions;

export function PrivacyPolicyYourContributions() {
  return <StandardPrivacyPolicySection {...strings} />;
}
