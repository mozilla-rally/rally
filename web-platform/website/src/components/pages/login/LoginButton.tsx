import { Button, ButtonProps, Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Spacing, createResponsiveStyle, ScreenSize } from "../../../styles";

export interface LoginButtonProps extends ButtonProps {
  icon?: string;
}

export function LoginButton(props: LoginButtonProps) {
  const { className, children, icon, ...otherProps } = props;

  return (
    <Button
      className={`w-100 ${styles.loginButton} ${className || ""}`}
      {...otherProps}
    >
      <Container className="w-100 flex-nowrap">
        <Row className="justify-content-center align-items-center">
          {icon && (
            <Col className="col-auto">
              <img
                src={icon}
                width={20}
                height="auto"
                alt={props["aria-label"]}
              />
            </Col>
          )}
          <Col className="text-nowrap">{children}</Col>
        </Row>
      </Container>
    </Button>
  );
}

const styles = {
  loginButton: style({
    paddingTop: Spacing.Medium,
    paddingBottom: Spacing.Medium,
    borderWidth: 2,
    fontWeight: 700,
  },
  createResponsiveStyle(ScreenSize.ExtraSmall, {
    padding: "10px"
  })
  ),
};
