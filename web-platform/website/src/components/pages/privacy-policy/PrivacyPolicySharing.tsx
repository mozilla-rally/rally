import { Strings } from "../../../resources/Strings";
import { StandardPrivacyPolicySection } from "./StandardPrivacyPolicySection";

const strings = Strings.components.pages.privacyPolicy.sharing;

export function PrivacyPolicySharing() {
  return <StandardPrivacyPolicySection {...strings} />;
}
