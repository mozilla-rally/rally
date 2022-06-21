import { useRef, useState } from "react";
import {
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { Colors } from "../../../styles";
import { Fonts } from "../../../styles/Fonts";
import { Highlighter } from "../../Highlighter";
import { LoginButton } from "./LoginButton";
import {
  LoginFormValidationResult,
  validateLoginForm,
} from "./LoginFormValidator";
import { PasswordRuleViolations } from "./PasswordRuleViolations";
import { PrivacyNoticeAndLoginLink } from "./PrivacyNoticeAndLoginLink";

const strings = Strings.components.pages.login.emailSignupView;

export function EmailSignupView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationResult, setValidationResult] =
    useState<LoginFormValidationResult>();

  const isEmailInvalid = Boolean(
    validationResult && validationResult.email && validationResult.email.error
  );

  const isPasswordInvalid = Boolean(
    validationResult &&
      validationResult.password &&
      validationResult.password.error
  );

  // Prevents closure in validateAndSignup

  const emailRef = useRef(email);
  emailRef.current = email;

  const passwordRef = useRef(password);
  passwordRef.current = password;

  function validateAndSignup() {
    setValidationResult(undefined);

    const validationResult = validateLoginForm(
      emailRef.current,
      passwordRef.current
    );

    setValidationResult(validationResult);

    if (!validationResult.valid) {
      return;
    }

    // TODO: Place authentication call here...
  }

  return (
    <Container className={`${styles.container} p-0`}>
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <Highlighter>
            <h1 className={Fonts.Headline}>{strings.title}</h1>
          </Highlighter>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            <FormGroup className="mb-4">
              <Label for="email" className="fw-bold">
                {strings.email}
              </Label>
              <Input
                id="email"
                type="email"
                autoFocus={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                invalid={isEmailInvalid}
              />
              {isEmailInvalid && (
                <FormFeedback className="email-error">
                  {validationResult?.email.error}
                </FormFeedback>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="password" className="fw-bold">
                {strings.password}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                invalid={isPasswordInvalid}
              />
              {isPasswordInvalid && (
                <FormFeedback className="password-error">
                  {validationResult?.password.error}
                </FormFeedback>
              )}

              <PasswordRuleViolations
                validationResult={validationResult}
                className="mt-3"
              />
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <LoginButton
            className="login-button"
            onClick={() => validateAndSignup()}
          >
            {strings.continue}
          </LoginButton>
        </Col>
      </Row>
      <Row>
        <PrivacyNoticeAndLoginLink />
      </Row>
    </Container>
  );
}

const styles = {
  container: style({
    $nest: {
      ".login-button": {
        color: Colors.ColorWhite,
        backgroundColor: Colors.ColorBlack,
        $nest: {
          "&:hover": {
            color: Colors.ColorBlack,
            backgroundColor: Colors.ColorMarketingGray20,
          },
        },
      },
    },
  }),
};
