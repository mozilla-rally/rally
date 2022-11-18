import { useState } from "react";
import { Alert, Button, Container } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../../resources/Strings";
import {
  Colors,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../../../styles";
import { ToastButton } from "../../../../styles/Buttons";
import { ToastStyle } from "../../../../styles/Toasts";

const closeIcon = Strings.components.pages.home.alerts.closeIcon;

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
    <Container
      className={`${styles.alert} ${ToastStyle.productToast} ${
        isShown ? "" : styles.hide
      }`}
    >
      <Alert
        className={`${type} ${styles.toast} `}
        isOpen={isShown && !isDismissed}
      >
        <div className={`d-flex justify-content-end align-items-center h-100`}>
          <div className="d-flex flex-grow-1 justify-content-center">
            <div>{text}</div>
            <Button
              onClick={async () => {
                onTakeAction && onTakeAction();
                link && window.open(link, "_blank", "noreferrer");
              }}
              className={`${ToastButton} toast-btn`}
            >
              {button}
            </Button>
          </div>

          {isDismissable && (
            <img
              onClick={() => setIsDismissed(true)}
              className="close-icon"
              src={closeIcon}
              alt="x icon"
            />
          )}
        </div>
      </Alert>
    </Container>
  );
}

const styles = {
  alert: style(
    createResponsiveStyle(ScreenSize.ExtraSmall, {
      height: "auto",
    }),
    {
      color: "#ffffff",

      $nest: {
        ".alert-success": {
          height: "100%",
          margin: "0",
          color: Colors.ColorWhite,
          borderColor: Colors.ColorTransparent,
          borderRadius: "0",
        },

        ".verify-email": {
          backgroundColor: Colors.ColorBlueToast3,
        },
        ".privacy-policy": {
          backgroundColor: Colors.ColorBlueToast2,
        },
        ".add-extension": {
          backgroundColor: Colors.ColorBlueToast1,
        },
        ".warning-icon, .toast-btn": {
          marginLeft: Spacing.Micro,
        },
        ".close-icon": {
          width: Spacing.xLarge,
          height: Spacing.xLarge,
          cursor: "pointer",
          margin: "7px 16px 7px 0",
          color: Colors.ColorWhite,
        },
      },
    }
  ),
  hide: style({
    display: "none",
  }),
  toast: style(
    {
      padding: "0",
    },
    createResponsiveStyle(ScreenSize.ExtraSmall, {
      padding: "10px",
    })
  ),
};
