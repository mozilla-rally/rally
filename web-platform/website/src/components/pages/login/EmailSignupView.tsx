import { FirebaseError } from "@firebase/util";
import { useEffect, useRef, useState } from "react";
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

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { PrimaryButton } from "../../../styles/Buttons";
import { Fonts } from "../../../styles/Fonts";
import { getFirebaseErrorMessage } from "../../../utils/FirebaseErrors";
import { Highlighter } from "../../Highlighter";
import { LoginButton } from "./LoginButton";
import { LoginState, useLoginDataContext } from "./LoginDataContext";
import {
  LoginFormValidationResult,
  validateLoginForm,
  validatePasswordRules,
} from "./LoginFormValidator";
import { PasswordRules } from "./PasswordRules";
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

  useEffect(() => {
    const rules = validatePasswordRules(password);
    const isValid = !rules.find((rule) => !rule.valid);
    setValidationResult((validationResult) => ({
      ...(validationResult || {
        email: { error: undefined },
        password: { error: undefined },
      }),
      valid: isValid,
      passwordRules: (passwordRef.current && rules) || [],
    }));
  }, [password]);

  const { signupWithEmail } = useAuthentication();
  const { setLoginState } = useLoginDataContext();

  async function validateAndSignup() {
    setValidationResult(undefined);

    const validationResult = validateLoginForm(
      emailRef.current,
      passwordRef.current
    );

    setValidationResult(validationResult);

    if (!validationResult.valid) {   
      return;
    }

    try {
      await signupWithEmail(emailRef.current, passwordRef.current);
      setLoginState(LoginState.EmailAccountCreated);
    } catch (e) {
      setValidationResult({
        email: { error: getFirebaseErrorMessage(e as FirebaseError) },
        password: {},
        passwordRules: [],
        valid: false,
      });
    }
  }

  return (
    <Container className="p-0">
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

              <PasswordRules
                rules={
                  (validationResult && validationResult.passwordRules) || []
                }
                className="mt-3"
              />
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <LoginButton
            className={PrimaryButton}
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
