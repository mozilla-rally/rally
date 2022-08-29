import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { ScreenSize, Spacing, createResponsiveStyle } from "../../../styles";
import { ContainerSmallerStyles } from "../../../styles/ContainerStyles";
import { Layout } from "../../Layout";
import { ProfileAge } from "./ProfileAge";
import { ProfileButtons } from "./ProfileButtons";
import { ProfileDataProvider } from "./ProfileDataContext";
import { ProfileEthnicity } from "./ProfileEthnicity";
import { ProfileGender } from "./ProfileGender";
import { ProfileHispanicBackground } from "./ProfileHispanicBackground";
import { ProfileIncome } from "./ProfileIncome";
import { ProfileSchool } from "./ProfileSchool";
import { ProfileTitle } from "./ProfileTitle";
import { ProfileZipCode } from "./ProfileZipCode";

export function ProfilePageContent() {
  return (
    <Layout>
      <Container
        className={`${styles.marginStyle} ${ContainerSmallerStyles.TopLevelContainer} pt-md-5 pt-0 pb-5 g-0`}
      >
        <Row className={`g-0 ${styles.row}`}>
          <Col className={`col-auto ${styles.nav}`} />
          <Col>
            <ProfileDataProvider>
              <ProfileTitle />
              <ProfileAge className="mb-5" />
              <ProfileGender className="mb-5" />
              <ProfileHispanicBackground className="mb-5" />
              <ProfileEthnicity className="mb-5" />
              <ProfileSchool className="mb-5" />
              <ProfileIncome className="mb-5" />
              <ProfileZipCode />
              <ProfileButtons />
            </ProfileDataProvider>
          </Col>
        </Row>
      </Container>
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
