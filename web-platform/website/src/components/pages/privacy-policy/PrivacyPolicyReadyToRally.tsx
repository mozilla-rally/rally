import { Strings } from "../../../resources/Strings";
import { StandardPrivacyPolicySection } from "./StandardPrivacyPolicySection";

const strings = Strings.components.pages.privacyPolicy.readyToRally;

export function PrivacyPolicyReadyToRally() {
  return <StandardPrivacyPolicySection {...strings} />;
}
