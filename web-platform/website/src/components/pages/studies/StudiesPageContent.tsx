import { Container, Row, Col} from "reactstrap";
import { style } from "typestyle";
import {
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../../styles";
import { Layout } from "../../Layout";
import { StudiesBackground } from "./StudiesBackground";
import { StudiesTitle } from "./StudiesTitle";
import { StudiesTooltip } from "./StudiesTooltip";
import { StudyList } from "./StudyList";
import { ContainerSmallerStyles } from "../../../styles/ContainerStyles";

export function StudiesPageContent() {
  return (
    <Layout>
      <StudiesBackground>
        <Container className={`${ContainerSmallerStyles.TopLevelContainer} ${styles.marginStyle} pt-md-5 pt-0 pb-5 g-0`}>
          <Row className={`g-0 ${styles.row}`}>
            <Col className={`col-auto ${styles.nav}`} />
            <Col>
              <StudiesTitle className="title" />
              <StudiesTooltip className="mb-5" />
              <StudyList />
            </Col>
          </Row>
        </Container>
      </StudiesBackground>
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
        margin: "0"
      },
      true
    )),
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
      width: "232px"
    },
    createResponsiveStyle(
      ScreenSize.Large,
      {
        marginRight: Spacing.xxxLarge,
        display: "block"
      },
      true
    )
  ),
};
