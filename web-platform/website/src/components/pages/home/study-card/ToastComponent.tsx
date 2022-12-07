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
import { FontSizeRaw } from "../../../../styles/Fonts";
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

  isShown;

  return (
    <Container className={`${styles.alert} ${ToastStyle.productToast}`}>
      <Alert
        className={`${type} ${styles.toast} d-flex justify-content-end align-items-center`}
        isOpen={isShown && !isDismissed}
      >
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
      $nest: {
        ".verify-email": {
          backgroundColor: Colors.ColorBlueToast3,
        },
        ".privacy-policy": {
          backgroundColor: Colors.ColorBlueToast2,
        },
        ".add-extension": {
          backgroundColor: Colors.ColorBlueToast1,
        },
        ".toast-btn": {
          ...FontSizeRaw.Small,
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
  toast: style(
    {
      ...FontSizeRaw.Small,
      padding: "0",
      height: "38px",
      margin: "0",
      color: Colors.ColorWhite,
      borderColor: Colors.ColorTransparent,
      borderRadius: "0",
      lineHeight: `${Spacing.Large + 4}px`,
    },
    createResponsiveStyle(ScreenSize.ExtraSmall, {
      padding: "10px",
      lineHeight: `${Spacing.Large + 2}px`,
    })
  ),
};
