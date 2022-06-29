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

export function DesktopMenu() {
  const { user, logout } = useAuthentication();

  const commands: { [key: string]: () => Promise<void> } = {
    logout,
  };

  return (
    <UncontrolledDropdown className={styles.menu}>
      <DropdownToggle className="menu-button">
        <img
          className="menu-icon"
          src="/img/icon-profile.svg"
          alt={strings.a11y.menuButton}
        />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>
          <div className={"text-center text-nowrap"}>
            {user && user.firebaseUser && user.firebaseUser.email}
          </div>
        </DropdownItem>

        {strings.sections.map((section) => (
          <div key={section.heading}>
            <hr />
            <DropdownItem header={true}>{section.heading}</DropdownItem>
            {section.links.map((link, i) => (
              <DropdownItem
                key={`${i}-link.href`}
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
          className="text-center text-secondary"
          href={strings.dataAndPrivacy.link}
          target="_blank"
        >
          {strings.dataAndPrivacy.text}
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}

const styles = {
  menu: style({
    $nest: {
      ".dropdown-menu": {
        marginRight: Spacing.Small,
      },
      ".menu-button": {
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
        $nest: {
          "&:hover, &:focus": {
            backgroundColor: "transparent",
            border: "none",
            boxShadow: "none",
          },
        },
      },
      ".menu-icon:hover": {
        backgroundColor: Colors.ColorMarketingGray20,
        borderRadius: "50%",
      },
      ".dropdown-item": {
        fontSize: 14,
        minWidth: "16rem",
      },
      hr: {
        marginTop: Spacing.Micro,
        marginBottom: Spacing.Micro,
      },
    },
  }),
};
