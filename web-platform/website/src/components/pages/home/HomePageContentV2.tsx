import { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { useUserDocument } from "../../../services/UserDocumentService";
import { ScreenSize, createResponsiveStyle } from "../../../styles";
import { ContainerSmallerStyles } from "../../../styles/ContainerStyles";
import { Layout } from "../../Layout";
import { PrivacyPolicyModal } from "../privacy-policy/PrivacyPolicyModal";
import { HomePageBackground } from "./HomePageBackground";
import { ProductToasts } from "./ProductToasts";
import { SurveyCard } from "./SurveyCard";
import { News } from "./news";

export function HomePageContentV2() {
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
          className={`${ContainerSmallerStyles.TopLevelContainer} ${styles.marginStyle} mw-100 pt-md-5 pt-0 pb-5 g-0`}
        >
          <Row className={`g-0 m-0 ${styles.row}`}>
            <Col>
              <SurveyCard />
              <News />
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
};
