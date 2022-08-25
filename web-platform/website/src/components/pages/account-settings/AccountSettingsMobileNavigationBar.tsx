import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Col,
  Container,
  Row,
  UncontrolledAccordion,
} from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { Colors, Spacing } from "../../../styles";
import { StandardAccordion } from "../../../styles/Accordions";
import { ContainerStyles } from "../../../styles/ContainerStyles";
import { FontSize, FontSizeRaw } from "../../../styles/Fonts";
import {
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "./AccountSettingsDataContext";

const strings = Strings.components.pages.accountSettings.navigationBar;

export function AccountSettingsMobileNavigationBar() {
  return (
    <Container
      className={`${styles.container} ${ContainerStyles.NoSpacing} g-0 d-md-none`}
    >
      {strings.sections.map((section) => {
        if (section.links) {
          return <AccordionSection {...section} key={section.text} />;
        }
      })}
    </Container>
  );
}

function AccordionSection(section: {
  text: string;
  icon: string;
  command: string;
  links: {
    accountType?: string;
    text: string;
    command: string;
  }[];
}) {
  const { userType } = useAuthentication();
  const { accountSettingsState } = useAccountSettingsDataContext();

  return (
    <UncontrolledAccordion
      defaultOpen="1"
      open="1"
      className={`${StandardAccordion}`}
    >
      <AccordionItem>
        <AccordionHeader
          targetId="1"
          className={`${
            accountSettingsState === section.command
              ? "active-command"
              : "command"
          } pe-3`}
        >
          <Container className="p-0">
            <LinkSection {...section} />
          </Container>
        </AccordionHeader>
        <AccordionBody accordionId="1">
          {section.links.map(({ accountType, command, text }, i) => {
            if (accountType && userType !== accountType) {
              return null;
            }

            return (
              <LinkSection
                text={text}
                command={command}
                subCommand={true}
                key={i}
              />
            );
          })}
        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  );
}

type CommonLinkProps = {
  text: string;
  icon?: string;
  subCommand?: boolean;
};

type Link = CommonLinkProps & { link: string; external: boolean };

type Command = CommonLinkProps & { command: string };

function LinkSection(link: Link | Command) {
  const isCommand = (link as Command).command;

  const { accountSettingsState, setAccountSettingsState } =
    useAccountSettingsDataContext();
  return (
    <Row>
      <Col>
        <a
          href={isCommand ? "#" : (link as Link).link}
          {...(isCommand
            ? {
                onClick: () =>
                  setAccountSettingsState(
                    (link as Command).command as AccountSettingsState
                  ),
              }
            : {
                rel: "noreferrer",
                target: (link as Link).external ? "_blank" : "_self",
              })}
          className={`section text-decoration-none ${
            isCommand &&
            link.subCommand &&
            accountSettingsState === (link as Command).command
              ? "active-command"
              : "command"
          }`}
        >
          <Container className="p-0">
            <Row className="d-flex align-items-center">
              <Col
                className={`${FontSize.Small} ${
                  link.subCommand ? "ms-3" : "titleStyle"
                }`}
              >
                {link.text}
              </Col>
            </Row>
          </Container>
        </a>
      </Col>
    </Row>
  );
}

const styles = {
  container: style({
    minWidth: 200 + Spacing.xxLarge, // Aligns with top navigation logo column
    marginBottom: Spacing.Large,

    $nest: {
      ".icon": {
        width: 20,
        height: 20,
      },

      ".section": {
        padding: Spacing.Medium,
        display: "flex",
      },

      ".titleStyle": {
        ...FontSizeRaw.Large,
        fontWeight: "500",
      },

      ".active-command": {
        backgroundColor: Colors.ColorMarketingGray20,
      },

      ".command:hover": {
        backgroundColor: Colors.ColorLightGray100,
      },
    },
  }),
};
