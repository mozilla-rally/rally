import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { ScreenSize, Spacing, createResponsiveStyle } from "../../../styles";
import { ContainerSmallerStyles } from "../../../styles/ContainerStyles";
import { Layout } from "../../Layout";
import { AcccountResetPasswordView } from "./AccountResetPasswordView";
import {
  AccountSettingsDataContextProvider,
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "./AccountSettingsDataContext";
import { AccountSettingsMobileNavigationBar } from "./AccountSettingsMobileNavigationBar";
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
          className={`${ContainerSmallerStyles.TopLevelContainer} ${styles.marginStyle} pt-md-5 pt-0 pb-5 g-0`}
        >
          <Row className={`g-0 ${styles.row}`}>
            <Col className={`col-auto ${styles.nav}`}>
              <AccountSettingsMobileNavigationBar />
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

    case AccountSettingsState.ResetPassword:
      return <AcccountResetPasswordView />;

    default:
      throw new Error("Invalid account settings state.");
  }
}

const styles = {
  marginStyle: style(
    {
      margin: "auto",
    },
    createResponsiveStyle(
      ScreenSize.Large,
      {
        margin: "0",
      },
      true
    )
  ),
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
