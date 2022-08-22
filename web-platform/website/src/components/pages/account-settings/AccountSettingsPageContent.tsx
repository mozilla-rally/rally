import { useState, useEffect } from "react";
import { Col, Container, Row, Toast, ToastBody } from "reactstrap";
import { style } from "typestyle";
import { Spacing, Colors } from "../../../styles";
import { ContainerStyles } from "../../../styles/ContainerStyles";
import { Layout } from "../../Layout";
import {
  AccountSettingsDataContextProvider,
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "./AccountSettingsDataContext";
import { AccountSettingsNavigationBar } from "./AccountSettingsNavigationBar";
import { AccountSettingsView } from "./AccountSettingsView";
import { DeleteAccountView } from "./DeleteAccountView";
import { EditAccountEmailView } from "./EditAccountEmailView";
import { EditAccountPasswordView } from "./EditAccountPasswordView";

export function AccountSettingsPageContent() {

  const [toastVisible, setVisibility] = useState(false);
  const [opacity, setOpacity] = useState("");

  const showToast = (val: boolean) => {
    setVisibility(val)
    setTimeout(() => {
      setOpacity("opacity-0")
    }, 3000);
  }

  return (
    <Layout>
      <AccountSettingsDataContextProvider>
        <Container
          className={`${ContainerStyles.TopLevelContainer} ${styles.container} m-0 pt-5 pb-5 g-0`}
        >
          <Row className="g-0">
            <Col className="col-auto nav">
              <AccountSettingsNavigationBar />
            </Col>
            <Col>
              <Toast className={`m-auto position-absolute account-toast d-flex justify-content-center ${toastVisible == true ? opacity : ""}`} fade={toastVisible == true} isOpen={toastVisible}>
                <img
                  className="align-self-center"
                  src="img/icon-status-checkmark.svg"
                  alt="checkmark icon"
                  width="24px"
                  height="24px"
                />
                <ToastBody className="text-center">Successfully changed password</ToastBody>
              </Toast>
              <AccountSettingsContentFactory showToast={showToast} />
            </Col>
          </Row>
        </Container>
      </AccountSettingsDataContextProvider>
    </Layout>
  );
}

export function AccountSettingsContentFactory(props: any) {
  const { accountSettingsState } = useAccountSettingsDataContext();
  const { showToast } = props

  switch (accountSettingsState) {
    case AccountSettingsState.AccountSettings:
      return <AccountSettingsView />;

    case AccountSettingsState.DeleteAccount:
      return <DeleteAccountView />;

    case AccountSettingsState.EditEmail:
      return <EditAccountEmailView />;

    case AccountSettingsState.EditPassword:
      return <EditAccountPasswordView showToast={showToast} />;

    default:
      throw new Error("Invalid account settings state.");
  }
}

const styles = {
  container: style({
    $nest: {
      ".nav": {
        marginRight: Spacing.xxxLarge, // Aligns with top navigation logo column
      },
      ".account-toast": {
        backgroundColor: Colors.ColorGreen10,
        width: "302px",
        fontSize: "0.938rem",
        opacity: 1,
        left: "800px"
      },
      ".opacity-0": {
        opacity: "0"
      }
    },
  }),
};
