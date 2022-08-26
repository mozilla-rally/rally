import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Spacing, ScreenSize, createResponsiveStyle } from "../../../styles";
import { ContainerAccountStyles } from "../../../styles/ContainerStyles";
import { Layout } from "../../Layout";
import {
  AccountSettingsDataContextProvider,
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "./AccountSettingsDataContext";
import { AccountSettingsNavigationBarWrapper } from "./AccountSettingsNavigationBarWrapper";
import { AccountSettingsView } from "./AccountSettingsView";
import { DeleteAccountView } from "./DeleteAccountView";
import { EditAccountEmailView } from "./EditAccountEmailView";
import { EditAccountPasswordView } from "./EditAccountPasswordView";

export function AccountSettingsPageContent() {
  return (
    <Layout>
      <AccountSettingsDataContextProvider>
        <Container
          className={`${ContainerAccountStyles.TopLevelContainer} m-0 pt-md-5 pt-0 pb-5 g-0`}
        >
          <Row className={`g-0 ${styles.row}`}>
            <Col className={`col-auto ${styles.nav}`}>
              <AccountSettingsNavigationBarWrapper />
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
  row: style(
    {
      display: "block",
    },
    createResponsiveStyle(
      ScreenSize.Medium,
      {
        display: "flex !important",
      },
      true
    )
  ),

  nav: style(
    {
      marginRight: 0,
    },
    createResponsiveStyle(
      ScreenSize.Medium,
      {
        marginRight: Spacing.xxxLarge,
      },
      true
    )
  ),
};
