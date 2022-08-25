import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Spacing } from "../../../styles";
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
              <AccountSettingsContentFactory />
            </Col>
          </Row>
        </Container>
      </AccountSettingsDataContextProvider>
    </Layout>
  );
}

export function AccountSettingsContentFactory() {
  const { accountSettingsState } = useAccountSettingsDataContext();

  switch (accountSettingsState) {
    case AccountSettingsState.AccountSettings:
      return <AccountSettingsView />;

    case AccountSettingsState.DeleteAccount:
      return <DeleteAccountView />;

    case AccountSettingsState.EditEmail:
      return <EditAccountEmailView />;

    case AccountSettingsState.EditPassword:
      return <EditAccountPasswordView />;

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
    },
  }),
};
