import { Strings } from "../../../resources/Strings";
import { StandardPrivacyPolicySection } from "./StandardPrivacyPolicySection";

const strings = Strings.components.pages.privacyPolicy.dataCollectionTypes;

export function PrivacyPolicyDataCollectionTypes() {
  return <StandardPrivacyPolicySection {...strings} />;
}
