import { useEffect, useState } from "react";
import { Alert, Button, Container } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { Colors, Spacing } from "../../../styles";
import { ProductButton } from "../../../styles/Buttons";

const verifyEmailStrings = Strings.components.alerts.verifyEmail;

export function ProductToasts(props: { openModal: object }) {
  const [showEmailNotVerifiedToast, setShowEmailNotVerifiedToast] =
    useState<boolean>(false);

  const { isUserVerified, user } = useAuthentication();

  useEffect(() => {
    if (user && user.firebaseUser && !isUserVerified) {
      setShowEmailNotVerifiedToast(true);
    }
  }, [isUserVerified, user]);

  return (
    <Container className={styles.container}>
      {showEmailNotVerifiedToast && <VerifyEmailToast {...props} />}
    </Container>
  );
}

function VerifyEmailToast(props: { openModal: object }) {
  const { sendEmailVerification } = useAuthentication();
  const [toastVisible, setToastVisibility] = useState<boolean>(true);

  return (
    <Alert {...props} className="verify-email" isOpen={toastVisible}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="left d-flex">
          <img
            className="warning-icon"
            src={verifyEmailStrings.icon}
            alt="warning icon"
          />
          <div>{verifyEmailStrings.text}</div>
        </div>

        <div className="right d-flex align-items-center">
          <Button
            onClick={async () => {
              await sendEmailVerification();
              props && props.openModal && (props.openModal as () => void)();
              setToastVisibility(false);
            }}
            className={`${ProductButton} resend-btn`}
          >
            {verifyEmailStrings.button}
          </Button>

          <img
            onClick={() => setToastVisibility(false)}
            className="close-icon"
            src={verifyEmailStrings.close}
            alt="x icon"
          />
        </div>
      </div>
    </Alert>
  );
}

const styles = {
  container: style({
    position: "absolute",
    top: Spacing.Medium,
    width: "1226px",
    $nest: {
      ".verify-email": {
        backgroundColor: Colors.ColorYellow100,
      },
      ".warning-icon": {
        marginRight: Spacing.xSmall,
      },
      ".resend-btn": {
        marginRight: Spacing.xSmall,
      },
      ".close-icon": {
        width: Spacing.xLarge,
        height: Spacing.xLarge,
        cursor: "pointer",
      },
    },
  }),
};
