import { Container } from "reactstrap";
import { style } from "typestyle";

import { FullscapePageContainer } from "../../../styles";
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
    <Container className={`${styles.container} ${FullscapePageContainer}`}>
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
    </Container>
  );
}

const styles = {
  container: style({
    $nest: {
      hr: {
        border: "none",
        borderTop: "1px dashed black",
        backgroundColor: "transparent",
        opacity: 1,
      },
    },
  }),
};
