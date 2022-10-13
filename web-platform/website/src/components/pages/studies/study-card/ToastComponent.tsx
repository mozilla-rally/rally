import { useEffect, useState } from "react";
import { Alert, Button, Container } from "reactstrap";
import { style } from "typestyle";

import { useAuthentication } from "../../../../services/AuthenticationService";
import { useStudies } from "../../../../services/StudiesService";
import { Colors, Spacing } from "../../../../styles";
import { ProductButton } from "../../../../styles/Buttons";
import { LinkStyles } from "../../../../styles/LinkStyles";
import { detectBrowser } from "../../../../utils/BrowserDetector";
import { BrowserType } from "../../../../utils/BrowserType";
import { Strings } from "../../../../resources/Strings";

const strings = Strings.components.pages.studies.alerts;

interface ToastProps {
  icon: string;
  text: string;
  button: string;
  type: string;
  close?: string;
  onOpenModal?: () => void;
  link?: boolean;
  dismissable?: boolean;
}

export function ToastComponent({
  icon,
  text,
  button,
  close,
  type,
  onOpenModal,
  link,
  dismissable,
}: ToastProps) {
  const { sendEmailVerification } = useAuthentication();
  const [toastVisible, setToastVisibility] = useState<boolean>(true);
  const [chromeLink, setChromelink] = useState("");
  const [fxLink, setFxlink] = useState("");
  const [browserType] = useState(detectBrowser());
  const { allStudies } = useStudies();

  useEffect(() => {
    allStudies.forEach((study) => {
      if (study.authors.name === "Mozilla Rally") {
        setChromelink(study.downloadLink.chrome);
        setFxlink(study.downloadLink.firefox);
      }
    });
  }, [allStudies]);

  return (
    <Container className={styles.alert}>
      <Alert className={`${type} `} isOpen={toastVisible}>
        <div className={`d-flex align-items-center justify-content-between `}>
          <div className="left d-flex">
            <img
              width="24px"
              height="24px"
              className="warning-icon"
              src={icon}
              alt="warning icon"
            />
            <div>{text}</div>
          </div>

          <div className="right d-flex align-items-center">
            <Button
              onClick={async () => {
                if (type === strings.verifyEmail.type) {
                  try {
                    await sendEmailVerification();
                  } catch (e) {
                    console.error(
                      "Error when trying to resend email verification:",
                      e
                    );
                  }
                  (onOpenModal as () => void)();
                  setToastVisibility(false);
                } else if (type === strings.privacyPolicy.type) {
                  (onOpenModal as () => void)();
                }
              }}
              className={`${ProductButton} toast-btn`}
            >
              {link ? (
                <a
                  className={LinkStyles.NoUnderline}
                  href={
                    browserType === BrowserType.Chrome ? chromeLink : fxLink
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {button}
                </a>
              ) : (
                button
              )}
            </Button>
            {dismissable && close && (
              <img
                onClick={() => setToastVisibility(false)}
                className="close-icon"
                src={close}
                alt="x icon"
              />
            )}
          </div>
        </div>
      </Alert>
    </Container>
  );
}

const styles = {
  alert: style({
    color: "#000000",
    $nest: {
      "alert-success": {
        backgroundColor: "none",
      },

      ".verify-email": {
        backgroundColor: Colors.ColorYellow100,
      },
      ".privacy-policy, .add-extension": {
        backgroundColor: Colors.ColorRed100,
      },
      ".warning-icon, .toast-btn": {
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
