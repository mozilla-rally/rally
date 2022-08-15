import { FirebaseError } from "@firebase/app";
import { useEffect, useRef, useState } from "react";
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

export function EditAccountEmailView() {
  const [confirmationView, setConfirmationView] = useState(false);
  const [email, setEmail] = useState("");
  const [isDisabled, setDisabled] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisbile] = useState(false);
  const [eyeIconVisible, setVisibility] = useState(false);
  const [validationResult, setValidationResult] =
    useState<LoginFormValidationResult>();
  const { setAccountSettingsState } = useAccountSettingsDataContext();
  const { changeUserEmail } = useAuthentication();

  const isEmailInvalid = Boolean(
    validationResult && validationResult.email && validationResult.email.error
  );

  const isPasswordInvalid = Boolean(
    validationResult &&
      validationResult.password &&
      validationResult.password.error
  );

  // Prevents closure in validateAndUpdate
  const emailRef = useRef(email);
  emailRef.current = email;

  const passwordRef = useRef(password);
  passwordRef.current = password;

  useEffect(() => {
    setValidationResult((validationResult) => ({
      ...(validationResult || {
        email: { error: undefined },
        password: { error: undefined },
      }),
      valid: true,
      passwordRules: [],
    }));
  }, []);

  const handleChange = (e: any) => {
    setValidationResult({
      email: {},
      password: {},
      passwordRules: [],
      valid: true,
    });

    setDisabled(false);
    if (e.target.value === "") {
      setDisabled(true);
    }
    if (e.target.name === "password") {
      setPassword(e.target.value);
      setVisibility(true);
      return;
    }
    if (e.target.name === "email") {
      setEmail(e.target.value);
      return;
    }
  };

  async function validateAndUpdate() {
    const validationResult = validateLoginForm(
      emailRef.current,
      passwordRef.current
    );

    setValidationResult(validationResult);

    if (!validationResult || !validationResult.valid) {
      return;
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

      setVisibility(false);
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
                  <div className="d-flex flex-row-reverse">
                    <div className="w-100">
                      <Input
                        id="password"
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={handleChange}
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
                        id="show-eye"
                        width="24px"
                        height="24px"
                        onClick={() => setPasswordVisbile(!passwordVisible)}
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
