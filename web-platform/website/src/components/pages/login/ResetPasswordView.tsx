import { FirebaseError } from "firebase/app";
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

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { PrimaryButton } from "../../../styles/Buttons";
import { FontSize, Fonts } from "../../../styles/Fonts";
import { getFirebaseErrorMessage } from "../../../utils/FirebaseErrors";
import { Highlighter } from "../../Highlighter";
import { LoginButton } from "./LoginButton";
import { LoginState, useLoginDataContext } from "./LoginDataContext";
import { validateEmailAndReturnError } from "./LoginFormValidator";

const strings = Strings.components.pages.login.resetPasswordView;

interface CardLocation {
  isAccount?: boolean | null;
}

export function ResetPasswordView({ isAccount = null }: CardLocation) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [emailError, setEmailError] = useState<string | null>("");

  const { setLoginState } = useLoginDataContext();
  const { sendPasswordResetEmail } = useAuthentication();

  const emailRef = useRef(email);
  emailRef.current = email;

  async function validateAndSendConfirmationEmail() {
    setEmailError("");

    const emailValidationError = validateEmailAndReturnError(emailRef.current);

    setEmailError(emailValidationError);

    if (emailValidationError) {
      return;
    }

    try {
      await sendPasswordResetEmail(emailRef.current);
      setEmailSent(true);
    } catch (e) {
      setEmailError(getFirebaseErrorMessage(e as FirebaseError));
    }
  }

  const title = emailSent
    ? strings.postEmailSent.title
    : strings.preEmailSent.title;

  const message = emailSent
    ? strings.postEmailSent.messageFormat.replace("{email}", emailRef.current)
    : strings.preEmailSent.message;

  return (
    <Container className="p-0">
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <Highlighter>
            <h1 className={Fonts.Headline}>{title}</h1>
          </Highlighter>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <span className="text-center">{message}</span>
        </Col>
      </Row>
      {emailSent ? (
        <>
          {!isAccount && (
            <Row className="mb-5">
              <Col>
                <LoginButton
                  className={PrimaryButton}
                  onClick={() => {
                    setLoginState(LoginState.Login);
                  }}
                >
                  {strings.postEmailSent.backToSignIn}
                </LoginButton>
              </Col>
            </Row>
          )}

          <Row>
            <Col className="d-flex justify-content-center">
              <span className={FontSize.Small}>
                {strings.postEmailSent.needHelp}
              </span>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row className="mt-4 mb-1">
            <Col>
              <Form>
                <FormGroup className="mb-4">
                  <Label for="email" className="fw-bold">
                    {strings.preEmailSent.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoFocus={true}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    invalid={Boolean(emailError)}
                  />
                  {emailError && (
                    <FormFeedback className="email-error">
                      {emailError}
                    </FormFeedback>
                  )}
                </FormGroup>
              </Form>
            </Col>
          </Row>
          <Row className={`${!isAccount ? "mb-5" : ""}`}>
            <Col>
              <LoginButton
                className={PrimaryButton}
                onClick={() => validateAndSendConfirmationEmail()}
              >
                {strings.preEmailSent.resetPassword}
              </LoginButton>
            </Col>
          </Row>
          {!isAccount && (
            <Row>
              <Col className="text-center">
                {strings.preEmailSent.backTo}{" "}
                <a
                  className="fw-bold"
                  href="#"
                  onClick={() => setLoginState(LoginState.Login)}
                >
                  {strings.preEmailSent.signIn}
                </a>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
}
