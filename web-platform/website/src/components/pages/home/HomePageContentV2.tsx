import { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useUserDocument } from "../../../services/UserDocumentService";
import { ScreenSize, createResponsiveStyle } from "../../../styles";
import { ContainerSmallerStyles } from "../../../styles/ContainerStyles";
import { FontSize, Fonts } from "../../../styles/Fonts";
import { Layout } from "../../Layout";
import { PrivacyPolicyModal } from "../privacy-policy/PrivacyPolicyModal";
import { HomePageBackground } from "./HomePageBackground";
import { HomePageTitle } from "./HomePageTitle";
import { ProductToasts } from "./ProductToasts";
import { StatsBox } from "./StatsBox";
import { SurveyCard } from "./SurveyCard";
import { News } from "./news";
import { PervasivePixels } from "./pervasive-pixels";

const headline = Strings.components.pages.home.headline;

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
        <HomePageTitle />

        <Container
          className={`${ContainerSmallerStyles.TopLevelContainer} ${styles.marginStyle} mw-100 pt-md-5 pt-0 pb-5 g-0`}
        >
          <Row className={`g-0 m-0 ${styles.row} d-flex flex-column`}>
            <Col className="d-flex justify-content-center m-auto col-12 col-lg-9">
              <StatsBox />
            </Col>
            <Col className="d-flex justify-content-center m-auto col-12 col-lg-9 mt-3">
              <SurveyCard />
            </Col>
            <Col className="d-flex flex-column justify-content-center m-auto col-12 col-lg-9 mt-5">
              <div className={`${Fonts.Headline} ${FontSize.xxLarge}`}>
                {headline.headline}
              </div>
              <PervasivePixels />
            </Col>
            <Col className="mt-5">
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
