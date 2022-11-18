import { useEffect, useState } from "react";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { ProductCheckEmailDialog } from "./ProductCheckEmailDialog";
import { ToastComponent } from "./study-card/ToastComponent";

const emailStrings = Strings.components.pages.home.alerts.verifyEmail;

export function EmailNotVerifiedToast() {
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false);
  const [showEmailNotVerifiedToast, setShowEmailNotVerifiedToast] =
    useState<boolean>(false);
  const { isUserVerified, reloadUser, sendEmailVerification } =
    useAuthentication();

  useEffect(() => {
    reloadUser();
  }, []);

  useEffect(() => {
    setShowEmailNotVerifiedToast(!isUserVerified);
  }, [isUserVerified]);

  return (
    <>
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
    </>
  );
}
