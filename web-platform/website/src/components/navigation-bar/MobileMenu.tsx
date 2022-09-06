import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../resources/Strings";
import { useAuthentication } from "../../services/AuthenticationService";
import { Colors, Spacing } from "../../styles";

const strings = Strings.components.navigationBar;

export function MobileMenu() {
  const { user, logout } = useAuthentication();

  const commands: { [key: string]: () => Promise<void> } = {
    logout,
  };

  return (
    <div className={styles.mobileMenu}>
      <UncontrolledDropdown>
        <DropdownToggle className="mobile-menu-button">
          <span className="mobile-menu-icon" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <div className={"text-center"}>
              {user && user.firebaseUser && user.firebaseUser.email}
            </div>
          </DropdownItem>

          {strings.sections.map((section) => (
            <div key={section.heading}>
              <hr />
              <DropdownItem header={true}>{section.heading}</DropdownItem>
              {section.links.map((link, i) => (
                <DropdownItem
                  key={`${i}link.href`}
                  href={link.href}
                  target={link.external ? "_blank" : "_self"}
                  {...(link.command
                    ? {
                        onClick: () =>
                          commands &&
                          commands[link.command] &&
                          commands[link.command](),
                      }
                    : {})}
                >
                  {link.text}
                </DropdownItem>
              ))}
            </div>
          ))}

          <hr />

          <DropdownItem
            className="text-center"
            href={strings.dataAndPrivacy.link}
            target="_blank"
          >
            {strings.dataAndPrivacy.text}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
}

const styles = {
  mobileMenu: style({
    $nest: {
      hr: {
        margin: 0,
        marginBottom: Spacing.Small,
      },
      a: {
        fontSize: "unset",
        fontWeight: 400,
      },
      ".mobile-menu-button": {
        width: Spacing.xxLarge,
        height: Spacing.xxLarge,
        backgroundColor: "transparent",
        padding: 0,
        border: "none",
        cursor: "pointer",
        boxShadow: "none",

        $nest: {
          "&:hover, &:focus": {
            backgroundColor: "unset",
            border: "none",
            boxShadow: "none",
          },
          ".mobile-menu-icon": {
            display: "inline-block",
            marginTop: Spacing.Small,
            marginBottom: Spacing.Small,
            position: "relative",
            verticalAlign: "middle",
            borderRadius: 10,
            backgroundColor: Colors.ColorMarketingGray99,
            height: Spacing.Micro,
            transition: "0.2s",
            transitionProperty: "background- color, transform",
            width: "100%",

            $nest: {
              "&:before, &:after": {
                left: 0,
                content: "''",
                position: "absolute",
                borderRadius: 10,
                backgroundColor: Colors.ColorMarketingGray99,
                height: Spacing.Micro,
                transition: "0.2s",
                transitionProperty: "background- color, transform",
                width: "100%",
              },
              "&:before": {
                top: -10,
              },
              "&:after": {
                top: 10,
              },
            },
          },

          "&[aria-expanded='true']": {
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
            $nest: {
              ".mobile-menu-icon": {
                backgroundColor: "transparent",
                $nest: {
                  "&:before": {
                    transform: "translateY(10px) rotate(45deg)",
                  },
                  "&:after": {
                    transform: "translateY(-10px) rotate(-45deg)",
                  },
                },
              },
            },
          },
        },
      },

      ".dropdown.show": {
        position: "initial",

        $nest: {
          ".dropdown-menu": {
            transform: "none",
            width: "100%",
            borderRadius: Spacing.Micro,
            border: "none",
            borderBottom: "1px solid #cdcdd4",
          },
        },
      },
    },
  }),
};
