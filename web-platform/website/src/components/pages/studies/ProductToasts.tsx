import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { useStudies } from "../../../services/StudiesService";
import { useUserDocument } from "../../../services/UserDocumentService";
import { Spacing } from "../../../styles";
import { PrivacyPolicyPageContentV2 } from "../privacy-policy/PrivacyPolicyPageContentV2";
import { ProductCheckEmailDialog } from "./ProductCheckEmailDialog";
import { ToastComponent } from "./study-card/ToastComponent";

const emailStrings = Strings.components.pages.studies.alerts.verifyEmail;
const privacyStrings = Strings.components.pages.studies.alerts.privacyPolicy;
const extensionStrings = Strings.components.pages.studies.alerts.addExtension;

export function ProductToasts() {
  const [showEmailNotVerifiedToast, setShowEmailNotVerifiedToast] =
    useState<boolean>(false);
  const [showAddExtensionToast, setShowAddExtenionToast] =
    useState<boolean>(false);
  const [showAddPrivacyToast, setShowAddPrivacyToast] =
    useState<boolean>(false);
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState<boolean>(false);

  const { user, isUserVerified, reloadUser } = useAuthentication();
  const { installedStudyIds, rallyExtensionStudy } = useStudies();
  const { userDocument } = useUserDocument();

  useEffect(() => {
    if (!reloadUser) {
      return;
    }
    reloadUser();
  }, [user, reloadUser]);

  useEffect(() => {
    setShowEmailNotVerifiedToast(!isUserVerified);
  }, [isUserVerified]);

  useEffect(() => {
    if (!rallyExtensionStudy?.studyId) {
      return;
    }
    setShowAddExtenionToast(
      !installedStudyIds.includes(rallyExtensionStudy.studyId)
    );
  }, [installedStudyIds, rallyExtensionStudy]);

  useEffect(() => {
    if (!userDocument) {
      return;
    }
    setShowAddPrivacyToast(!userDocument.enrolled);
  }, [userDocument]);

  if (!user) {
    return null;
  }

  return (
    <Container className={styles.container}>
      {showAddPrivacyToast && (
        <ToastComponent
          {...privacyStrings}
          onOpenModal={() => setShowPrivacyDialog(true)}
        />
      )}

      {showAddExtensionToast && (
        <ToastComponent {...extensionStrings} link={true} />
      )}

      {showEmailNotVerifiedToast && (
        <ToastComponent
          {...emailStrings}
          dismissable={true}
          onOpenModal={() => setShowEmailDialog(true)}
        />
      )}

      {showEmailDialog && <ProductCheckEmailDialog />}
      {showPrivacyDialog && <PrivacyPolicyPageContentV2 />}
    </Container>
  );
}

const styles = {
  container: style({
    marginTop: Spacing.Medium,
    width: "1226px",
    zIndex: 100,
  }),
};
