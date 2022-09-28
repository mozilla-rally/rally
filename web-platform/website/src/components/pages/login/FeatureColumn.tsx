import { Col, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { Colors } from "../../../styles";
import { Spacing } from "../../../styles";
import { Fonts } from "../../../styles/Fonts";

const strings = Strings.components.pages.login.initialLoginView.launch;

export function FeatureColumn() {
  return (
    <Row className={`${styles.row} feauture-column`}>
      <Col className={`${styles.col}`}>
        <RenderInitialView />
      </Col>
    </Row>
  );
}

//the content in the column will potentially change depending on
//where users are in the onboarding flow
function RenderInitialView() {
  return (
    <>
      <h4 className={`${Fonts.Headline} ${styles.featureText} text-center`}>
        {strings.columnText}
      </h4>
      <div className="d-flex justify-content-center">
        <img
          src="img/illustration-group-rally.png"
          alt="people carrying flags"
        />
      </div>
    </>
  );
}

const styles = {
  row: style({
    backgroundColor: Colors.ColorLightGray20,
    height: "100%",
  }),
  col: style({
    marginTop: "118px",
    padding: `0 ${Spacing.xxxLarge - 2}px`,
  }),
  featureText: style({
    color: Colors.ColorMarketingGray70,
    paddingTop: `${Spacing.xxxLarge + 4}px`,
    paddingBottom: `${Spacing.xLarge - 4}px`,
  }),
};
