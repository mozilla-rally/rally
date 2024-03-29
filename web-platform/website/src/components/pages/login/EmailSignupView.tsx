import { FirebaseError } from "@firebase/util";
import { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { PrimaryButton, PrimaryButtonInAction } from "../../../styles/Buttons";
import { getFirebaseErrorMessage } from "../../../utils/FirebaseErrors";
import { InputControl } from "../../InputControl";
import { LoginButton } from "./LoginButton";
import {
  LoginFormValidationResult,
  validateLoginForm,
  validatePasswordRules,
} from "./LoginFormValidator";
import { PasswordRules } from "./PasswordRules";
import { PrivacyNoticeAndLoginLink } from "./PrivacyNoticeAndLoginLink";

const strings = Strings.components.pages.login.emailSignupView;
const passwordErrorStrings = Strings.utils.passwordErrorMessages;

export function EmailSignupView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyeIconVisible, setEyeIconVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validationResult, setValidationResult] =
    useState<LoginFormValidationResult>();
  const [isSignupInProgress, setIsSignupInProgress] = useState(false);
  const [emailSubscription, setEmailSubscription] = useState(false);

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

  async function validateAndSignup() {
    if (isSignupInProgress) {
      return;
    }

    setValidationResult(undefined);
    setIsSignupInProgress(true);

    const validationResult = validateLoginForm(
      emailRef.current,
      passwordRef.current
    );

    setValidationResult(validationResult);

    if (!validationResult.valid) {
      setValidationResult({
        ...validationResult,
        password: { error: passwordErrorStrings.passwordError },
      });
      setIsSignupInProgress(false);
      return;
    }

    if (emailSubscription) {
      window.sessionStorage.setItem("subscribedToEmail", "true");
    }

    try {
      await signupWithEmail(emailRef.current, passwordRef.current);
    } catch (e) {
      setValidationResult({
        email: { error: getFirebaseErrorMessage(e as FirebaseError) },
        password: {},
        passwordRules: [],
        valid: false,
      });
    }

    setIsSignupInProgress(false);
  }

  return (
    <Container className="p-0">
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
                disabled={isSignupInProgress}
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
              <Container className="p-0">
                <Label for="password" className="fw-bold">
                  {strings.password}
                </Label>
                <Row>
                  <Col className="position-relative">
                    <InputGroup>
                      <Input
                        id="password"
                        className="rounded-1"
                        type={passwordVisible ? "text" : "password"}
                        disabled={isSignupInProgress}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setEyeIconVisible(true);
                        }}
                        invalid={isPasswordInvalid}
                      />

                      {eyeIconVisible && (
                        <InputGroupText className="bg-white">
                          <img
                            className="toggle-password align-self-center"
                            src={
                              !passwordVisible
                                ? "img/icon-password-show.svg"
                                : "img/icon-password-hide.svg"
                            }
                            alt={
                              passwordVisible ? "open eye" : "eye with slash"
                            }
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          />
                        </InputGroupText>
                      )}
                      {isPasswordInvalid && (
                        <FormFeedback className="password-error">
                          {validationResult?.password.error}
                        </FormFeedback>
                      )}
                    </InputGroup>

                    <PasswordRules
                      rules={
                        (validationResult && validationResult.passwordRules) ||
                        []
                      }
                      className="mt-3"
                    />
                  </Col>
                </Row>
              </Container>
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <InputControl
            title={strings.emailSubscription}
            name={strings.emailSubscription}
            type="checkbox"
            checked={emailSubscription}
            className="me-3"
            key={strings.emailSubscription}
            value={""}
            onChange={(event) => {
              setEmailSubscription(event.target.checked);
            }}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <LoginButton
            className={
              isSignupInProgress ? PrimaryButtonInAction : PrimaryButton
            }
            onClick={() => validateAndSignup()}
          >
            {isSignupInProgress ? strings.creatingAccount : strings.continue}
          </LoginButton>
        </Col>
      </Row>
      <Row>
        <PrivacyNoticeAndLoginLink />
      </Row>
    </Container>
  );
}
