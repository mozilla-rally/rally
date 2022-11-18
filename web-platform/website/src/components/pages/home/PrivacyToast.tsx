import { useEffect, useState } from "react";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { useUserDocument } from "../../../services/UserDocumentService";
import { PrivacyPolicyModal } from "../privacy-policy/PrivacyPolicyModal";
import { ToastComponent } from "./study-card/ToastComponent";

const privacyStrings = Strings.components.pages.home.alerts.privacyPolicy;

export function PrivacyToast() {
  const [showAddPrivacyToast, setShowAddPrivacyToast] =
    useState<boolean>(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState<boolean>(false);
  const { reloadUser } = useAuthentication();
  const { userDocument } = useUserDocument();

  useEffect(() => {
    reloadUser();
  }, []);

  useEffect(() => {
    setShowAddPrivacyToast((userDocument && !userDocument.enrolled) ?? false);
  }, [userDocument]);

  return (
    <>
      <ToastComponent
        {...privacyStrings}
        isShown={showAddPrivacyToast}
        onTakeAction={() => {
          setShowPrivacyDialog(true);
        }}
      />

      {showPrivacyDialog && <PrivacyPolicyModal />}
    </>
  );
}
