import { useEffect } from "react";
import { Container } from "reactstrap";
import { style } from "typestyle";

import { useAuthentication } from "../../../services/AuthenticationService";
import { AddExtensionToast } from "./AddExtensionToast";
import { EmailNotVerifiedToast } from "./EmailNotVerifiedToast";
import { PrivacyToast } from "./PrivacyToast";

export function ProductToasts() {
  const { reloadUser } = useAuthentication();

  useEffect(() => {
    reloadUser();
  }, []);

  return (
    <Container className={styles.container}>
      <AddExtensionToast />
      <PrivacyToast />
      <EmailNotVerifiedToast />
    </Container>
  );
}

const styles = {
  container: style({
    width: "100%",
    maxWidth: "unset",
    zIndex: 100,
    padding: 0,
  }),
};
