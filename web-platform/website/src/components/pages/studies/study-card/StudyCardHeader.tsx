import { useState } from "react";
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
import { Colors, Spacing } from "../../../../styles";
import { FontSize } from "../../../../styles/Fonts";
import { detectBrowser } from "../../../../utils/BrowserDetector";
import { BrowserType } from "../../../../utils/BrowserType";
import { useStudy } from "./StudyDataContext";

const strings = Strings.components.pages.studies.studyCard.header;

export function StudyCardHeader() {
  const {
    isInstalledLocally,
    isUserEnrolled,
    startStudyEnrollmentToggle,
    study,
  } = useStudy();
  const [browserType] = useState(detectBrowser());

  if (!isUserEnrolled && !isInstalledLocally) {
    return null;
  }

  const message =
    isUserEnrolled && isInstalledLocally
      ? strings.participating
      : strings.notParticipatingYet;

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
          <Col>
            {message}
            {!isInstalledLocally ? (
              <a
                href={
                  browserType === BrowserType.Chrome
                    ? study.downloadLink.chrome
                    : study.downloadLink.firefox
                }
                target="_blank"
                rel="noreferrer"
                className="fw-bold"
                style={{ color: Colors.ColorBlue50 }}
              >
                {browserType === BrowserType.Chrome
                  ? strings.addExtension
                  : strings.addExtension_fx}
              </a>
            ) : (
              <></>
            )}
          </Col>
          {(!isInstalledLocally || isUserEnrolled) && (
            <Col className="col-auto">
              <UncontrolledDropdown>
                <DropdownToggle>
                  <img src="/img/overflow-ellipsis.svg" alt="" />
                </DropdownToggle>
                <DropdownMenu>
                  {!isInstalledLocally ? (
                    <DropdownItem className={FontSize.Small}>
                      <a
                        href={
                          browserType === BrowserType.Chrome
                            ? study.downloadLink.chrome
                            : study.downloadLink.firefox
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-none"
                      >
                        {strings.menus.addExtension}
                      </a>
                    </DropdownItem>
                  ) : null}

                  <DropdownItem
                    className={FontSize.Small}
                    onClick={() => startStudyEnrollmentToggle()}
                  >
                    {isInstalledAndConnected
                      ? strings.menus.leaveStudy
                      : strings.menus.dontJoinStudy}
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
