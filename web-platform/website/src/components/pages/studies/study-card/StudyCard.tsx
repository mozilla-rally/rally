import { Container } from "reactstrap";
import { style } from "typestyle";

import { Colors, Spacing } from "../../../../styles";
import { FontSize } from "../../../../styles/Fonts";
import { StudyCardHeader } from "./StudyCardHeader";
import { StudyDetails } from "./StudyDetails";

export function StudyCard() {
  return (
    <Container className={`${styles.container} ${FontSize.Small} p-0 mb-5`}>
      <StudyCardHeader />
      <StudyDetails />
    </Container>
  );
}

const styles = {
  container: style({
    boxSizing: "border-box",
    boxShadow: `0 5px 10px rgba(14, 13, 26, 0.12), 0 3px 16px rgba(14, 13, 26, 0.12)`,
    borderRadius: Spacing.Micro,
    backgroundColor: Colors.ColorWhite,
  }),
};
