import { FirebaseError } from "@firebase/app";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Card, Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import {
  UserType,
  useAuthentication,
} from "../../../services/AuthenticationService";
import {
  Colors,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../../styles";
import { AccentButton, TertiaryButton } from "../../../styles/Buttons";
import { ColumnStyles } from "../../../styles/Columns";
import { ContainerStyles } from "../../../styles/ContainerStyles";
import { FontSizeRaw, Fonts } from "../../../styles/Fonts";
import { getFirebaseErrorMessage } from "../../../utils/FirebaseErrors";
import {
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "./AccountSettingsDataContext";
import { DeleteAccountConfirmation } from "./DeleteAccountConfirmation";

const strings = Strings.components.pages.accountSettings.deleteAccount;

export function DeleteAccountView() {
  const { setAccountSettingsState } = useAccountSettingsDataContext();
  const { deleteEmailUser, deleteGoogleUser, userType } = useAuthentication();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deletionError, setDeletionError] = useState("");

  const router = useRouter();

  return (
    <Card className={`flex-nowrap p-4 ${styles.acctCard}`}>
      <Container
        className={`${ContainerStyles.NoSpacing} ${styles.container} p-0`}
      >
        <Row className="mb-3">
          <Col>
            <h1 className={Fonts.Headline}>{strings.title}</h1>
          </Col>
        </Row>
        <Row className={`mb-3 content-row ${styles.contentRow}`}>
          <Col className="text-content">{strings.text}</Col>
          <Col>
            <img src="img/before-you-go.png" className="w-100" alt="" />
          </Col>
        </Row>
        <Row className="d-flex justify-content-between align-items-center flex-row-reverse">
          <Col className={`${ColumnStyles.account.buttonCol} col-auto`}>
            <Button
              className={`fw-bold ps-4 pe-4 pt-2 pb-2 ${AccentButton}`}
              onClick={async () => setShowConfirmationDialog(true)}
              outline
            >
              {strings.deleteAccount}
            </Button>

            <Button
              className={`fw-bold ps-4 pe-4 pt-2 pb-2 me-3 ${TertiaryButton}`}
              outline
              onClick={() =>
                setAccountSettingsState(AccountSettingsState.AccountSettings)
              }
            >
              {strings.cancel}
            </Button>
          </Col>
        </Row>
      </Container>
      {showConfirmationDialog && (
        <DeleteAccountConfirmation
          error={deletionError}
          toggle={() => {
            setDeletionError("");
            setShowConfirmationDialog(false);
          }}
          onDone={async (password) => {
            setDeletionError("");

            try {
              const isDeleted =
                userType === UserType.Google
                  ? await deleteGoogleUser()
                  : await deleteEmailUser(password as string);

              if (isDeleted) {
                router.replace(strings.deleteLandingPageUrl);
              }

              setShowConfirmationDialog(false);
            } catch (e) {
              setDeletionError(getFirebaseErrorMessage(e as FirebaseError));
            }
          }}
        />
      )}
    </Card>
  );
}

const styles = {
  acctCard: style(
    createResponsiveStyle(ScreenSize.ExtraSmall, {
      border: "none",
    })
  ),
  container: style({
    $nest: {
      ".text-content": {
        color: Colors.ColorMarketingGray70,

        $nest: {
          p: {
            color: Colors.ColorBlack,
          },

          li: {
            paddingTop: Spacing.Small,
            lineHeight: `${Spacing.xLarge}px`,
            ...FontSizeRaw.Small,
          },
        },
      },
    },
  }),
  contentRow: style(
    { display: "block" },
    createResponsiveStyle(
      ScreenSize.Large,
      {
        display: "flex",
      },
      true
    )
  ),
};
