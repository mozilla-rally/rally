import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { useStudies } from "../../../services/StudiesService";
import { useUserDocument } from "../../../services/UserDocumentService";
import { Spacing } from "../../../styles";
import { detectBrowser } from "../../../utils/BrowserDetector";
import { BrowserType } from "../../../utils/BrowserType";
import { PrivacyPolicyModal } from "../privacy-policy/PrivacyPolicyModal";
import { ProductCheckEmailDialog } from "./ProductCheckEmailDialog";
import { ToastComponent } from "./study-card/ToastComponent";

const emailStrings = Strings.components.pages.home.alerts.verifyEmail;
const privacyStrings = Strings.components.pages.home.alerts.privacyPolicy;
const extensionStrings = Strings.components.pages.home.alerts.addExtension;

export function ProductToasts() {
  const [showEmailNotVerifiedToast, setShowEmailNotVerifiedToast] =
    useState<boolean>(false);
  const [showAddExtensionToast, setShowAddExtenionToast] =
    useState<boolean>(false);
  const [showAddPrivacyToast, setShowAddPrivacyToast] =
    useState<boolean>(false);
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState<boolean>(false);
  const [browserType] = useState(detectBrowser());

  const { isUserVerified, reloadUser, sendEmailVerification } =
    useAuthentication();
  const { installedStudyIds, rallyExtensionStudy } = useStudies();
  const { userDocument } = useUserDocument();

  useEffect(() => {
    reloadUser();
  }, []);

  useEffect(() => {
    setShowEmailNotVerifiedToast(!isUserVerified);
  }, [isUserVerified]);

  useEffect(() => {
    setShowAddExtenionToast(
      !installedStudyIds.includes(rallyExtensionStudy?.studyId || "")
    );
  }, [installedStudyIds, rallyExtensionStudy]);

  useEffect(() => {
    setShowAddPrivacyToast((userDocument && !userDocument.enrolled) ?? false);
  }, [userDocument]);

  return (
    <Container className={styles.container}>
      <ToastComponent
        {...privacyStrings}
        isShown={showAddPrivacyToast}
        onTakeAction={() => {
          setShowPrivacyDialog(true);
        }}
      />

      <ToastComponent
        {...extensionStrings}
        isShown={showAddExtensionToast}
        link={
          browserType === BrowserType.Chrome
            ? rallyExtensionStudy?.downloadLink.chrome
            : rallyExtensionStudy?.downloadLink.firefox
        }
      />

      <ToastComponent
        {...emailStrings}
        isShown={showEmailNotVerifiedToast}
        isDismissable={true}
        onTakeAction={async () => {
          try {
            await sendEmailVerification();
          } catch (e) {
            console.error("Error when trying to resend email verification:", e);
          }
          setShowEmailNotVerifiedToast(false);
          setShowEmailDialog(true);
        }}
      />

      {showEmailDialog && <ProductCheckEmailDialog />}
      {showPrivacyDialog && <PrivacyPolicyModal />}
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
