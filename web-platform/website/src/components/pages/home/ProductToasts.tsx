import { Container } from "reactstrap";
import { style } from "typestyle";

import { AddExtensionToast } from "./AddExtensionToast";
import { EmailNotVerifiedToast } from "./EmailNotVerifiedToast";
import { PrivacyToast } from "./PrivacyToast";

export function ProductToasts() {
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
    padding: 0,
  }),
};
