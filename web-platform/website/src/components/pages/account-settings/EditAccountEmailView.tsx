import { FirebaseError } from "@firebase/app";
import { useRef, useState } from "react";
import {
  Button,
  Card,
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
import { useAuthentication } from "../../../services/AuthenticationService";
import { Colors, Spacing } from "../../../styles";
import {
  DisabledProductButton,
  ProductButton,
  TertiaryButton,
  TransparentButton,
} from "../../../styles/Buttons";
import { ContainerStyles } from "../../../styles/ContainerStyles";
import { FontSizeRaw, Fonts } from "../../../styles/Fonts";
import { getFirebaseErrorMessage } from "../../../utils/FirebaseErrors";
import {
  LoginFormValidationResult,
  validateLoginForm,
} from "../login/LoginFormValidator";
import {
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "./AccountSettingsDataContext";
import { EmailChangedView } from "./EmailChangedView";

const strings = Strings.components.pages.accountSettings.editEmailAccount;
const firebaseStings = Strings.utils.firebaseError.errorMessages;
const emailErrorStrings = Strings.utils.emailErrorMessages;

export function EditAccountEmailView() {
  const [confirmationView, setConfirmationView] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [eyeIconVisible, setEyeIconVisible] = useState(false);
  const [validationResult, setValidationResult] =
    useState<LoginFormValidationResult>();
  const { setAccountSettingsState } = useAccountSettingsDataContext();
  const { changeUserEmail, user } = useAuthentication();

  const isEmailInvalid = Boolean(
    validationResult && validationResult.email && validationResult.email.error
  );

  const isPasswordInvalid = Boolean(
    validationResult &&
      validationResult.password &&
      validationResult.password.error
  );

  const isDisabled = !email && !password;

  // Prevents closure in validateAndUpdate
  const emailRef = useRef(email);
  emailRef.current = email;

  const passwordRef = useRef(password);
  passwordRef.current = password;

  async function validateAndUpdate() {
    const validationResult = validateLoginForm(
      emailRef.current,
      passwordRef.current
    );

    setValidationResult(validationResult);

    if (!validationResult || !validationResult.valid) {
      setEyeIconVisible(false);
      if (validationResult.password) {
        if (!validationResult.password.error) {
          const passwordErr =
            "Invalid password. Requires 1 lowercase, 1 uppercase, 1 number, at least 8 characters";

          //when user enters passsword breaking password rules
          setValidationResult({
            ...validationResult,
            password: { error: passwordErr },
          });
        }
      }
      return;
    }

    if (user && user.firebaseUser) {
      if (email == user.firebaseUser.email) {
        setEyeIconVisible(false);
        

        setValidationResult({
          ...validationResult,
          email: { error: emailErrorStrings.newEmail},
        });
        return;
      }
    }

    try {
      await changeUserEmail(emailRef.current, passwordRef.current);
      setConfirmationView(true);
    } catch (e) {
      const error = getFirebaseErrorMessage(e as FirebaseError);
      let emailErr = "";
      let passwordErr = "";

      error.indexOf(firebaseStings["auth/email-already-in-use"]) > -1 ||
      error.indexOf(firebaseStings["auth/invalid-email"]) > -1
        ? (emailErr = error)
        : (emailErr = "");

      error.indexOf(firebaseStings["auth/wrong-password"]) > -1
        ? (passwordErr = error)
        : (passwordErr = "");

      setValidationResult({
        email: { error: emailErr },
        password: { error: passwordErr },
        passwordRules: [],
        valid: false,
      });

      setEyeIconVisible(false);
    }
  }

  return (
    <Card className="flex-nowrap p-4">
      {confirmationView ? (
        <EmailChangedView email={emailRef.current} />
      ) : (
        <Container
          className={`${ContainerStyles.NoSpacing} ${styles.container} p-0`}
        >
          <Row className="mb-3">
            <Col>
              <h1 className={Fonts.Headline}>{strings.title}</h1>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form>
                <FormGroup className="mb-4">
                  <Label for="email" className="fw-bold">
                    {strings.newEmail}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoFocus={true}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationResult)
                        setValidationResult({
                          ...validationResult,
                          email: {},
                        });
                    }}
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
                  <div className="d-flex flex-row-reverse">
                    <div className="w-100">
                      <Input
                        id="password"
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setEyeIconVisible(true);
                          if (validationResult)
                            setValidationResult({
                              ...validationResult,
                              password: {},
                            });
                        }}
                        invalid={isPasswordInvalid}
                      />

                      {isPasswordInvalid && (
                        <FormFeedback className="password-error">
                          {validationResult?.password.error}
                        </FormFeedback>
                      )}
                    </div>

                    {eyeIconVisible && (
                      <img
                        className="toggle-password align-self-center position-absolute m-1"
                        src={
                          !passwordVisible
                            ? "img/icon-password-show.svg"
                            : "img/icon-password-hide.svg"
                        }
                        alt={passwordVisible ? "open eye" : "eye with slash"}
                        width="24px"
                        height="24px"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      />
                    )}
                  </div>
                </FormGroup>
              </Form>
            </Col>
          </Row>
          <Row className="d-flex justify-content-between">
            <Col className="me-3 col-auto">
              <Button className={`fw-bold p-0 ${TransparentButton}`} outline>
                {strings.forgot}
              </Button>
            </Col>
            <Col className="col-auto d-flex justify-content-between">
              <Button
                className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 me-3 ${TertiaryButton}`}
                outline
                onClick={() =>
                  setAccountSettingsState(AccountSettingsState.AccountSettings)
                }
              >
                {strings.cancel}
              </Button>

              <Button
                className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${
                  isDisabled ? DisabledProductButton : ProductButton
                }`}
                outline
                disabled={isDisabled}
                onClick={() => validateAndUpdate()}
              >
                {strings.update}
              </Button>
            </Col>
          </Row>
        </Container>
      )}
    </Card>
  );
}

const styles = {
  container: style({
    $nest: {
      ".text-content": {
        color: Colors.ColorMarketingGray70,

        $nest: {
          p: {
            color: Colors.ColorBlack,
          },

          li: {
            paddingTop: Spacing.Small,
            lineHeight: `${Spacing.xLarge}px`,
            ...FontSizeRaw.Small,
          },
        },
      },
    },
  }),
};
