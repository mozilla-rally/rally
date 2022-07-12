import { Container } from "reactstrap";
import { style } from "typestyle";

import {
  FullscapePageContainer,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../../styles";
import { Layout } from "../../Layout";
import { StudiesBackground } from "./StudiesBackground";
import { StudiesTitle } from "./StudiesTitle";
import { StudiesTooltip } from "./StudiesTooltip";
import { StudyList } from "./StudyList";

export function StudiesPageContent() {
  return (
    <Layout>
      <StudiesBackground>
        <Container className={`${FullscapePageContainer} ${styles.container}`}>
          <StudiesTitle className="title" />
          <StudiesTooltip className="mb-5" />
          <StudyList />
        </Container>
      </StudiesBackground>
    </Layout>
  );
}

const styles = {
  container: style(
    {
      paddingTop: Spacing.xxxLarge,

      $nest: {
        ".title": {
          marginBottom: 35,
        },
      },
    },
    createResponsiveStyle(
      ScreenSize.Medium,
      {
        paddingLeft: 0,
        paddingRight: 0,
      },
      true
    )
  ),
};
