import { UserDocument } from "@mozilla/rally-shared-types";
import { logEvent } from "firebase/analytics";
import {
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../../resources/Strings";
import { useFirebase } from "../../../../services/FirebaseService";
import { useUserDocument } from "../../../../services/UserDocumentService";
import { Colors, Spacing } from "../../../../styles";
import { FontSize } from "../../../../styles/Fonts";
import { useStudy } from "./StudyDataContext";

const strings = Strings.components.pages.studies.studyCard.header;

export function StudyCardHeader() {
  const { isInstalledLocally, isUserEnrolled, study } = useStudy();
  const message =
    isUserEnrolled && isInstalledLocally
      ? strings.participating
      : strings.notParticipatingYet;

  const { analytics } = useFirebase();

  const { updateUserDocument } = useUserDocument();

  const isInstalledAndConnected = isInstalledLocally && isUserEnrolled;

  return (
    <>
      <Container
        className={`${styles.container} ${
          isInstalledAndConnected ? "joinAndConnected" : "notJoined"
        }`}
      >
        <Row className="d-flex align-items-center">
          <Col className="col-auto">
            <img
              style={{ width: Spacing.Large, height: Spacing.Large }}
              src={
                isInstalledAndConnected
                  ? "img/check-circle.svg"
                  : "img/warning.svg"
              }
              alt=""
            />
          </Col>
          <Col>{message}</Col>
          {isInstalledAndConnected && (
            <Col className="col-auto">
              <UncontrolledDropdown>
                <DropdownToggle>
                  <img src="/img/overflow-ellipsis.svg" alt="" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    className={FontSize.Small}
                    onClick={async () => {
                      await updateUserDocument({
                        studies: {
                          [study.studyId]: {
                            studyId: study.studyId,
                            enrolled: false,
                          },
                        },
                      } as Partial<UserDocument>);

                      logEvent(analytics, "select_content", {
                        content_type: `leave_study`,
                      });
                    }}
                  >
                    {strings.menus.leaveStudy}
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          )}
        </Row>
      </Container>
      <hr className="m-0" />
    </>
  );
}

const styles = {
  container: style({
    paddingTop: Spacing.Medium,
    paddingBottom: Spacing.Medium,
    paddingLeft: Spacing.xLarge,
    paddingRight: Spacing.xLarge,
    borderTopRightRadius: Spacing.Micro,
    borderTopLeftRadius: Spacing.Micro,

    $nest: {
      "&.joinAndConnected": {
        backgroundColor: "#D6FFF2",
      },

      "&.notJoined": {
        backgroundColor: "#ffe3c2",
      },

      ".dropdown": {
        $nest: {
          ".dropdown-item": {
            paddingLeft: Spacing.Large,
            paddingRight: Spacing.Large,
          },

          "> button": {
            backgroundColor: "unset",
            textDecoration: "none",
            borderWidth: 0,
            borderRadius: "50%",
            height: 28,
            width: 28,
            padding: 0,
            boxShadow: "none",

            $nest: {
              "&:hover": {
                backgroundColor: Colors.ColorMarketingGray30,
              },

              "&[aria-expanded=true]": {
                backgroundColor: Colors.ColorMarketingGray40,
              },
            },
          },
        },
      },
    },
  }),
};
