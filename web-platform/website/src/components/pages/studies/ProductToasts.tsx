import { useEffect, useState } from "react";
import { Alert, Button, Container } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { useStudies } from "../../../services/StudiesService";
import { useUserDocument } from "../../../services/UserDocumentService";
import { Colors, Spacing } from "../../../styles";
import { ProductButton } from "../../../styles/Buttons";
import { LinkStyles } from "../../../styles/LinkStyles";
import { detectBrowser } from "../../../utils/BrowserDetector";
import { BrowserType } from "../../../utils/BrowserType";

const emailStrings = Strings.components.pages.studies.alerts.verifyEmail;
const privacyStrings = Strings.components.pages.studies.alerts.privacyPolicy;
const extensionStrings = Strings.components.pages.studies.alerts.addExtension;

export function ProductToasts(props: {
  openModal: object;
  openPrivacyModal: object;
}) {
  const [showEmailNotVerifiedToast, setShowEmailNotVerifiedToast] =
    useState<boolean>(false);
  const [showAddExtensionToast, setShowAddExtenionToast] =
    useState<boolean>(false);
  const [showAddPrivacyToast, setShowAddPrivacyToast] =
    useState<boolean>(false);

  const { isUserVerified, user } = useAuthentication();
  const { installedStudyIds } = useStudies();
  const { userDocument } = useUserDocument();

  useEffect(() => {
    if (user && user.firebaseUser && !isUserVerified) {
      setShowEmailNotVerifiedToast(true);
    }

    if (!installedStudyIds.length) setShowAddExtenionToast(true);

    if (userDocument && !userDocument.enrolled) setShowAddPrivacyToast(true);
  }, [isUserVerified, user, installedStudyIds]);

  return (
    <Container className={styles.container}>
      {showAddPrivacyToast && (
        <ToastComponent
          {...privacyStrings}
          openPrivacyModal={props.openPrivacyModal}
        />
      )}

      {showAddExtensionToast && (
        <ToastComponent {...extensionStrings} link={true} />
      )}

      {showEmailNotVerifiedToast && (
        <ToastComponent {...emailStrings} openModal={props.openModal} />
      )}
    </Container>
  );
}

interface ToastProps {
  icon: string;
  text: string;
  button: string;
  type: string;
  close?: string;
  openModal?: object;
  openPrivacyModal?: object;
  link?: boolean;
}

function ToastComponent({
  icon,
  text,
  button,
  close,
  type,
  openModal,
  openPrivacyModal,
  link,
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
  }, [chromeLink, fxLink]);

  return (
    <Alert className={type} isOpen={toastVisible}>
      <div className="d-flex align-items-center justify-content-between">
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
              openModal ? await sendEmailVerification() : null;
              openModal && (openModal as () => void)();
              openPrivacyModal && (openPrivacyModal as () => void)();
              setToastVisibility(false);
            }}
            className={`${ProductButton} toast-btn`}
          >
            {link ? (
              <a
                className={LinkStyles.NoUnderline}
                href={browserType === BrowserType.Chrome ? chromeLink : fxLink}
                target="_blank"
                rel="noreferrer"
              >
                {button}
              </a>
            ) : (
              button
            )}
          </Button>
          {close && (
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
  );
}

const styles = {
  container: style({
    position: "absolute",
    top: Spacing.Medium,
    width: "1226px",
    zIndex: 100,
    $nest: {
      ".verify-email": {
        backgroundColor: Colors.ColorYellow100,
      },
      ".privacy-policy, .add-extension": {
        backgroundColor: Colors.ColorRed100,
      },

      ".success-extension, .success-privacy": {
        backgroundColor: Colors.ColorGreen10,
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
