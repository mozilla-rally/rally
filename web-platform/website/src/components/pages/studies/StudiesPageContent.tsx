import { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { useAuthentication } from "../../../services/AuthenticationService";
import { useUserDocument } from "../../../services/UserDocumentService";
import { ScreenSize, Spacing, createResponsiveStyle } from "../../../styles";
import { ContainerSmallerStyles } from "../../../styles/ContainerStyles";
import { Layout } from "../../Layout";
import { PrivacyPolicyPageContentV2 } from "../privacy-policy/PrivacyPolicyPageContentV2";
import { ProductCheckEmailDialog } from "./ProductCheckEmailDialog";
import { ProductToasts } from "./ProductToasts";
import { StudiesBackground } from "./StudiesBackground";
import { StudiesTitle } from "./StudiesTitle";
import { StudiesTooltip } from "./StudiesTooltip";
import { StudyList } from "./StudyList";

export function StudiesPageContent() {
  const [showPrivacyDialog, setShowPrivacyDialog] = useState<boolean>(false);
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false);
  const { logout } = useAuthentication();

  const { userDocument } = useUserDocument();

  useEffect(() => {
    if (userDocument && !userDocument.enrolled) {
      setShowPrivacyDialog(false);
    }
  }, [userDocument]);
  return (
    <Layout>
      <StudiesBackground>
        <ProductToasts
          openModal={() => {
            setShowEmailDialog(true);
          }}
        />
        <Container
          className={`${ContainerSmallerStyles.TopLevelContainer} ${styles.marginStyle} pt-md-5 pt-0 pb-5 g-0`}
        >
          <Row className={`g-0 ${styles.row}`}>
            <Col className={`col-auto ${styles.nav}`} />
            <Col>
              <StudiesTitle className="title" />
              <StudiesTooltip className="mb-5" />
              <StudyList />
            </Col>
          </Row>
          {showPrivacyDialog && (
            <PrivacyPolicyPageContentV2
              closeModal={() => setShowPrivacyDialog(false)}
            />
          )}
          {showEmailDialog && (
            <ProductCheckEmailDialog
              closeModal={async () => {
                setShowEmailDialog(false);
                await logout();
              }}
            />
          )}
        </Container>
      </StudiesBackground>
    </Layout>
  );
}

const styles = {
  alert: style({
    position: "absolute",
  }),
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
      display: "none",
      width: "232px",
    },
    createResponsiveStyle(
      ScreenSize.Large,
      {
        marginRight: Spacing.xxxLarge,
        display: "block",
      },
      true
    )
  ),
};
