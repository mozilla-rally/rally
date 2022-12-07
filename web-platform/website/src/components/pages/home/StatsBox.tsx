import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import {
  Colors,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../../styles";
import { CardStyles } from "../../../styles/Cards";

const strings = Strings.components.pages.home.statsBox;

export function StatsBox() {
  return (
    <Container
      className={`${CardStyles.product.container} ${styles.container} p-0`}
    >
      <Row className="d-flex box-row g-0">
        {strings.content.map((item, i) => (
          <Col
            key={i}
            className={`${styles.statBoxItem} d-flex flex-column justify-content-center align-items-center`}
          >
            <div className="box-item-content number">{item.number}</div>
            <div className="box-item-content text text-center">{item.text}</div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

const styles = {
  container: style({
    marginTop: `${Spacing.xLarge + 4}px`,
    boxShadow: "none",
    borderRight: "none",
    width: "100%",
    $nest: {
      ".box-row": {
        height: "100%",
      },
      ".number": {
        color: Colors.ColorInk30,
        fontSize: `${Spacing.xxLarge}px`,
        fontWeight: 700,
        lineHeight: `${Spacing.Small * 4}px`,
        marginBottom: Spacing.Small,
      },
      ".text": {
        textTransform: "uppercase",
        fontSize: `${Spacing.Medium + 2}px`,
      },
    },
  }),
  statBoxItem: style({
    padding: `${Spacing.Large + 4}px`,
    borderRight: "solid 1px #cdcdd4 ",
  }),
};
