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
import { PrimaryButton, TertiaryButton } from "../../../styles/Buttons";
import { FontSize, Fonts } from "../../../styles/Fonts";
import { getFirebaseErrorMessage } from "../../../utils/FirebaseErrors";
import { Highlighter } from "../../Highlighter";
import { LoginButton } from "./LoginButton";
import { LoginState, useLoginDataContext } from "./LoginDataContext";
import {
  LoginFormValidationResult,
  validateLoginForm,
} from "./LoginFormValidator";
import { UnverifiedEmailError } from "./UnverifiedEmailError";

const strings = Strings.components.pages.login.loginView;

export function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailNotVerifiedError, setShowEmailNotVerifiedError] =
    useState(false);
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

  const emailRef = useRef(email);
  emailRef.current = email;

  const passwordRef = useRef(password);
  passwordRef.current = password;

  const { loginWithEmail, loginWithGoogle, isLoaded, isUserVerified, user } =
    useAuthentication();

  useEffect(() => {
    if (isLoaded && user && user.firebaseUser && !isUserVerified) {
      setEmail(user.firebaseUser.email as string);
      setShowEmailNotVerifiedError(true);
    }
  }, [isLoaded, isUserVerified, user]);

  async function validateAndLogin() {
    setValidationResult(undefined);

    const validationResult = validateLoginForm(
      emailRef.current,
      passwordRef.current
    );

    setValidationResult(validationResult);

    if (validationResult.email.error || validationResult.password.error) {
      return;
    }

    try {
      await loginWithEmail(emailRef.current, passwordRef.current);
    } catch (e) {
      // Guess whether error is due to email or password
      const errMsg = getFirebaseErrorMessage(e as FirebaseError);
      const isPasswordError = errMsg.toLocaleLowerCase().includes("password");

      setValidationResult({
        email: { error: isPasswordError ? undefined : errMsg },
        password: { error: isPasswordError ? errMsg : undefined },
        passwordRules: [],
        valid: false,
      });
    }
  }

  const { setLoginState } = useLoginDataContext();

  return (
    <Container className="p-0">
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <Highlighter>
            <h1 className={Fonts.Headline}>{strings.title}</h1>
          </Highlighter>
        </Col>
      </Row>
      {showEmailNotVerifiedError && (
        <Row className="mb-3">
          <Col>
            <UnverifiedEmailError />
          </Col>
        </Row>
      )}
      <Row className="mb-3">
        <Col>
          <LoginButton
            icon="/img/icon-logo-google.svg"
            className={TertiaryButton}
            onClick={() => loginWithGoogle()}
            outline
          >
            {strings.signInWithGoogle}
          </LoginButton>
        </Col>
      </Row>
      <Row className="mb-3">
        <Container>
          <Row className="gx-0 gy-0 align-items-center d-flex">
            <Col>
              <hr />
            </Col>
            <Col className="col-auto ms-1 me-1">{strings.or}</Col>
            <Col>
              <hr />
            </Col>
          </Row>
        </Container>
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
              <Container className="p-0">
                <Row>
                  <Col>
                    <Label for="password" className="fw-bold">
                      {strings.password}
                    </Label>
                  </Col>
                  <Col className={`col-auto ${FontSize.Small}`}>
                    <a
                      href="#"
                      onClick={() => setLoginState(LoginState.ResetPassword)}
                    >
                      {strings.forgotPassword}
                    </a>
                  </Col>
                </Row>
              </Container>
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
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col>
          <LoginButton
            className={PrimaryButton}
            onClick={() => validateAndLogin()}
          >
            {strings.signIn}
          </LoginButton>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          {strings.dontHaveAnAccount}{" "}
          <a
            href="#"
            className="fw-bold"
            onClick={() => setLoginState(LoginState.Initial)}
          >
            {strings.createAccount}
          </a>
        </Col>
      </Row>
    </Container>
  );
}
