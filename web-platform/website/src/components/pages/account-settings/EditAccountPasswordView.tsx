import { FirebaseError } from "@firebase/app";
import { useRef, useState, useEffect } from "react";
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
  PasswordAccountValidationResult,
  validatePasswordAccountForm,
  validatePasswordRules
} from "../login/LoginFormValidator";
import {
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "./AccountSettingsDataContext";
import { PasswordRules } from "../login/PasswordRules";

const strings = Strings.components.pages.accountSettings.editPasswordAccount;
const firebaseStings = Strings.utils.firebaseError.errorMessages;

export function EditAccountPasswordView() {
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [eyeIconVisible, setEyeIconVisible] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [validationResult, setValidationResult] =
    useState<PasswordAccountValidationResult>();
  const { setAccountSettingsState } = useAccountSettingsDataContext();
  const { changeUserPassword } = useAuthentication();

  const isCurrentInvalid = Boolean(
    validationResult &&
    validationResult.currentPassword &&
    validationResult.currentPassword.error
  );

  const isNewInvalid = Boolean(
    validationResult &&
    validationResult.newPassword &&
    validationResult.newPassword.error
  );

  const isConfirmInvalid = Boolean(
    validationResult &&
    validationResult.confirmPassword &&
    validationResult.confirmPassword.error
  );

  const isDisabled = !password.current || !password.new || !password.confirm;

  // Prevents closure in validateAndUpdate
  const currentRef = useRef(password.current);
  currentRef.current = password.current;

  const newRef = useRef(password.new);
  newRef.current = password.new;

  const confirmRef = useRef(password.confirm);
  confirmRef.current = password.confirm;

  useEffect(() => {
    const rules = validatePasswordRules(password.new);
    const isValid = !rules.find((rule) => !rule.valid);
    setValidationResult((validationResult) => ({
      ...(validationResult || {
        currentPassword: { error: undefined },
        newPassword: { error: undefined },
        confirmPassword: { error: undefined },
      }),
      valid: isValid,
      passwordRules: (newRef.current && rules) || [],
    }));
  }, [password.new]);

  async function validateAndUpdate() {

    const hideEyeicon = {
      current: false,
      new: false,
      confirm: false
    }
    const validationResult = validatePasswordAccountForm(
      currentRef.current,
      newRef.current,
      confirmRef.current,
    );

    setValidationResult(validationResult);

    if (!validationResult || !validationResult.valid) {
      setEyeIconVisible(hideEyeicon);
      //when user enters new passsword breaking password rules
      if (!validationResult.newPassword.error) {
        const passwordErr = "Invalid password. Requires 1 lowercase, 1 uppercase, 1 number, at least 8 characters";

        setValidationResult({
          ...validationResult,
          newPassword: { error: passwordErr },
        });
      }
      return;
    }
    if (password.new !== password.confirm) {
      setEyeIconVisible(hideEyeicon);
      const passwordErr = "Passwords do not match";

      setValidationResult({
        ...validationResult,
        confirmPassword: { error: passwordErr },
      });
      return
    }
    try {
      await changeUserPassword(currentRef.current, newRef.current);
      setAccountSettingsState(AccountSettingsState.AccountSettings)
    } catch (e) {
      const error = getFirebaseErrorMessage(e as FirebaseError);
      let passwordErr = "";

      error.indexOf(firebaseStings["auth/wrong-password"]) > -1
        ? (passwordErr = error)
        : (passwordErr = "");

      setValidationResult({
        currentPassword: { error: passwordErr },
        newPassword: {},
        confirmPassword: {},
        passwordRules: [],
        valid: false,
      });

      setEyeIconVisible(hideEyeicon);
    }
  }

  return (
    <Card className="flex-nowrap p-4">

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
              <FormGroup>
                <Label for="currentPassword" className="fw-bold">
                  {strings.current}
                </Label>
                <div className="d-flex flex-row-reverse">
                  <div className="w-100">
                    <Input
                      id="currentPassword"
                      type={passwordVisible.current ? "text" : "password"}
                      name="password"
                      value={password.current}
                      onChange={(e) => {
                        setPassword({ ...password, current: e.target.value });
                        setEyeIconVisible({ ...eyeIconVisible, current: true });
                        if (validationResult)
                          setValidationResult({
                            ...validationResult,
                            currentPassword: {},
                          });
                      }}
                      invalid={isCurrentInvalid}
                    />

                    {isCurrentInvalid && (
                      <FormFeedback className="password-error">
                        {validationResult?.currentPassword.error}
                      </FormFeedback>
                    )}
                  </div>

                  {eyeIconVisible.current && (
                    <img
                      className="toggle-password align-self-center position-absolute m-1"
                      src={
                        !passwordVisible.current
                          ? "img/icon-password-show.svg"
                          : "img/icon-password-hide.svg"
                      }
                      alt={passwordVisible.current ? "open eye" : "eye with slash"}
                      width="24px"
                      height="24px"
                      onClick={() => setPasswordVisible({ ...passwordVisible, current: !passwordVisible.current })}
                    />
                  )}
                </div>
              </FormGroup>

              <FormGroup>
                <Label for="newPassword" className="fw-bold">
                  {strings.new}
                </Label>
                <div className="d-flex flex-row-reverse">
                  <div className="w-100">
                    <Input
                      id="newPassword"
                      type={passwordVisible.new ? "text" : "password"}
                      name="password"
                      value={password.new}
                      onChange={(e) => {
                        setPassword({ ...password, new: e.target.value });
                        setEyeIconVisible({ ...eyeIconVisible, new: true });
                        if (validationResult)
                          setValidationResult({
                            ...validationResult,
                            newPassword: {},
                          });
                      }}
                      invalid={isNewInvalid}
                    />

                    {isNewInvalid && (
                      <FormFeedback className="password-error">
                        {validationResult?.newPassword.error}
                      </FormFeedback>
                    )}
                  </div>

                  {eyeIconVisible.new && (
                    <img
                      className="toggle-password align-self-center position-absolute m-1"
                      src={
                        !passwordVisible.new
                          ? "img/icon-password-show.svg"
                          : "img/icon-password-hide.svg"
                      }
                      alt={passwordVisible.new ? "open eye" : "eye with slash"}
                      width="24px"
                      height="24px"
                      onClick={() => setPasswordVisible({ ...passwordVisible, new: !passwordVisible.new })}
                    />
                  )}
                </div>
                {eyeIconVisible.new && (
                  <PasswordRules
                    rules={
                      (validationResult && validationResult.passwordRules) || []
                    }
                    className="mt-3"
                  />
                )}
              </FormGroup>

              {/* CONFIRM PASSWORD */}
              <FormGroup>
                <Label for="confirmPassword" className="fw-bold">
                  {strings.confirm}
                </Label>
                <div className="d-flex flex-row-reverse">
                  <div className="w-100">
                    <Input
                      id="confirmPassword"
                      type={passwordVisible.confirm ? "text" : "password"}
                      name="password"
                      value={password.confirm}
                      onChange={(e) => {
                        setPassword({ ...password, confirm: e.target.value });
                        setEyeIconVisible({ ...eyeIconVisible, confirm: true });
                        if (validationResult)
                          setValidationResult({
                            ...validationResult,
                            confirmPassword: {},
                          });
                      }}
                      invalid={isConfirmInvalid}
                    />

                    {isConfirmInvalid && (
                      <FormFeedback className="password-error">
                        {validationResult?.confirmPassword.error}
                      </FormFeedback>
                    )}
                  </div>

                  {eyeIconVisible.confirm && (
                    <img
                      className="toggle-password align-self-center position-absolute m-1"
                      src={
                        !passwordVisible.confirm
                          ? "img/icon-password-show.svg"
                          : "img/icon-password-hide.svg"
                      }
                      alt={passwordVisible.confirm ? "open eye" : "eye with slash"}
                      width="24px"
                      height="24px"
                      onClick={() => setPasswordVisible({ ...passwordVisible, confirm: !passwordVisible.confirm })}
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
              className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${isDisabled ? DisabledProductButton : ProductButton
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
