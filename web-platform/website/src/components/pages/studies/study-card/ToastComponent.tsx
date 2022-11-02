import { useState } from "react";
import { Alert, Button, Container } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../../resources/Strings";
import { Colors, Spacing } from "../../../../styles";
import { ProductButton } from "../../../../styles/Buttons";

const closeIcon = Strings.components.pages.studies.alerts.closeIcon;

interface ToastProps {
  icon: string;
  text: string;
  button: string;
  type: string;
  isShown: boolean;
  onTakeAction?: () => void;
  link?: string;
  isDismissable?: boolean;
}

export function ToastComponent({
  icon,
  text,
  button,
  type,
  isShown,
  onTakeAction,
  link,
  isDismissable,
}: ToastProps) {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  return (
    <Container className={styles.alert}>
      <Alert className={`${type} `} isOpen={isShown && !isDismissed}>
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
                onTakeAction && onTakeAction();
                link && window.open(link, "_blank", "noreferrer");
              }}
              className={`${ProductButton} toast-btn`}
            >
              {button}
            </Button>
            {isDismissable && (
              <img
                onClick={() => setIsDismissed(true)}
                className="close-icon"
                src={closeIcon}
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
