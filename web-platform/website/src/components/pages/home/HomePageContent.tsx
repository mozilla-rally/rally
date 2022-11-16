import { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { useUserDocument } from "../../../services/UserDocumentService";
import { ScreenSize, Spacing, createResponsiveStyle } from "../../../styles";
import { ContainerSmallerStyles } from "../../../styles/ContainerStyles";
import { Layout } from "../../Layout";
import { PrivacyPolicyModal } from "../privacy-policy/PrivacyPolicyModal";
import { HomePageBackground } from "./HomePageBackground";
import { HomePageTitle } from "./HomePageTitle";
import { ProductToasts } from "./ProductToasts";
import { StudyList } from "./StudyList";
import { SurveyCard } from "./SurveyCard";

export function HomePageContent() {
  const [showPrivacyDialog, setShowPrivacyDialog] = useState<boolean>(false);

  const { userDocument } = useUserDocument();

  useEffect(() => {
    if (userDocument && !userDocument.enrolled) {
      setShowPrivacyDialog(true);
    }
  }, [userDocument]);
  return (
    <Layout>
      <HomePageBackground>
        <ProductToasts />
        <Container
          className={`${ContainerSmallerStyles.TopLevelContainer} ${styles.marginStyle} pt-md-5 pt-0 pb-5 g-0`}
        >
          <Row className={`g-0 ${styles.row}`}>
            <Col className={`col-auto ${styles.nav}`} />
            <Col>
              <HomePageTitle className="title mb-5" />
              <SurveyCard />
              <StudyList />
            </Col>
          </Row>
          {showPrivacyDialog && <PrivacyPolicyModal />}
        </Container>
      </HomePageBackground>
    </Layout>
  );
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
