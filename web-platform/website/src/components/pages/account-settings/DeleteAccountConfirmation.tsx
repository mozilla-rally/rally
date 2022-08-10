import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalProps,
  Row,
} from "reactstrap";
import { style } from "typestyle";
import { NestedCSSProperties } from "typestyle/lib/types";

import { Strings } from "../../../resources/Strings";
import {
  UserType,
  useAuthentication,
} from "../../../services/AuthenticationService";
import { AccentButton, TertiaryButton } from "../../../styles/Buttons";
import { Colors } from "../../../styles/Colors";
import { ContainerStyles } from "../../../styles/ContainerStyles";
import { FontsRaw } from "../../../styles/Fonts";
import { createResponsiveStyle } from "../../../styles/ResponsiveStyle";
import { ScreenSize } from "../../../styles/ScreenSize";
import { Spacing } from "../../../styles/Spacing";

export interface DeleteAccountConfirmationProps extends ModalProps {
  onDone: (password?: string) => void;
  error?: string;
}

const strings =
  Strings.components.pages.accountSettings.deleteAccountConfirmation;

export function DeleteAccountConfirmation(
  props: DeleteAccountConfirmationProps
) {
  const { userType } = useAuthentication();
  const [password, setPassword] = useState("");

  const isGoogleUser = userType === UserType.Google;

  return (
    <Modal
      {...props}
      isOpen={true}
      contentClassName={styles.modalContent}
      className={styles.modal}
    >
      <Container
        className={`p-0 g-0 m-0 ${styles.container} ${ContainerStyles.NoSpacing}`}
      >
        <Row>
          <Col>
            <h1>{strings.title}</h1>
          </Col>
        </Row>
        <Row>
          <Col>{isGoogleUser ? strings.googleText : strings.emailText}</Col>
        </Row>
        {!isGoogleUser && (
          <>
            <Row className="mt-3">
              <Col>
                <Form>
                  <FormGroup>
                    <Label for="password" className="fw-bold">
                      {strings.password}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      autoFocus={true}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          </>
        )}
        {props.error && (
          <Row>
            <Col className="text-danger">{props.error}</Col>
          </Row>
        )}
        <Row className="mt-3">
          <Col className="me-3 col-auto">
            <Button
              className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${TertiaryButton}`}
              outline
              onClick={() =>
                props && props.toggle && (props.toggle as () => void)()
              }
            >
              {strings.cancel}
            </Button>
          </Col>
          <Col className="col-auto">
            <Button
              className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${AccentButton}`}
              onClick={async () =>
                props && props.onDone && props.onDone(password)
              }
              disabled={isGoogleUser ? false : Boolean(!password)}
              outline
            >
              {strings.deleteAccount}
            </Button>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}

const smallModalStyle: NestedCSSProperties = {
  width: "100%",
  margin: 0,
};

const styles = {
  modal: style(
    createResponsiveStyle(ScreenSize.ExtraSmall, smallModalStyle),
    createResponsiveStyle(ScreenSize.Small, smallModalStyle),
    {
      maxWidth: "unset",
    }
  ),
  modalContent: style(
    createResponsiveStyle(ScreenSize.Small, {
      width: "unset",
    }),
    {
      width: 442,
      boxSizing: "content-box",
      maxWidth: "unset",
      padding: Spacing.xxLarge,
      marginLeft: "auto",
      marginRight: "auto",
    }
  ),
  container: style({
    maxWidth: "unset",

    color: Colors.ColorMarketingGray70,
    padding: Spacing.Large,
    marginBottom: Spacing.xLarge,
    $nest: {
      h1: {
        ...FontsRaw.Headline,
        fontSize: Spacing.xxxLarge,
        marginBottom: Spacing.xLarge,
        color: Colors.ColorBlack,
      },
      p: {
        marginLeft: 0,
        marginBottom: Spacing.Large,
        lineHeight: `${Spacing.xLarge}px`,
      },
    },
  }),
};
