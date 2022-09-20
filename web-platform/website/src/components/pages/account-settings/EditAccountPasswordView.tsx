import { FirebaseError } from "firebase/app";
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
  Toast,
  ToastBody,
} from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import {
  Colors,
  ScreenSize,
  Spacing,
  createResponsiveStyle,
} from "../../../styles";
import {
  DisabledProductButton,
  ProductButton,
  TertiaryButton,
  TransparentButton,
} from "../../../styles/Buttons";
import { CardStyles } from "../../../styles/Cards";
import { ColumnStyles } from "../../../styles/Columns";
import { ContainerStyles } from "../../../styles/ContainerStyles";
import { FontSizeRaw, Fonts } from "../../../styles/Fonts";
import { ToastStyle } from "../../../styles/Toasts";
import { getFirebaseErrorMessage } from "../../../utils/FirebaseErrors";
import {
  PasswordAccountValidationResult,
  validatePasswordAccountForm,
  validatePasswordRules,
} from "../login/LoginFormValidator";
import { PasswordRules } from "../login/PasswordRules";
import {
  AccountSettingsState,
  useAccountSettingsDataContext,
} from "./AccountSettingsDataContext";

const strings = Strings.components.pages.accountSettings.editPasswordAccount;
const passwordErrorStrings = Strings.utils.passwordErrorMessages;
const ToastStrings = Strings.utils.toastMessages;

export function EditAccountPasswordView() {
  const [toastVisible, setVisibility] = useState(false);
  const [opacity, setOpacity] = useState("");
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [eyeIconVisible, setEyeIconVisible] = useState({
    current: false,
    new: false,
    confirm: false,
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

      passwordRules: (newRef.current && rules) || [],
      validRules: null,
      valid: isValid,
    }));
  }, [password.new]);

  const showToast = (val: boolean) => {
    setVisibility(val);
    setTimeout(() => {
      setOpacity(ToastStyle.opacityZero);
    }, 3000);
  };

  async function validateAndUpdate() {
    const validationResult = validatePasswordAccountForm(
      currentRef.current,
      newRef.current,
      confirmRef.current
    );

    if (!validationResult.validRules) {
      setValidationResult({
        ...validationResult,
        newPassword: { error: passwordErrorStrings.invalidRules },
      });
      return;
    }

    setValidationResult(validationResult);
    if (!validationResult.valid) {
      return;
    }

    if (password.new.trim() !== password.confirm.trim()) {
      setValidationResult({
        ...validationResult,
        confirmPassword: { error: passwordErrorStrings.mismatched },
      });
      return;
    }

    try {
      await changeUserPassword(
        currentRef.current.trim(),
        newRef.current.trim()
      );
      showToast(true);
      setPassword({
        current: "",
        new: "",
        confirm: "",
      });

      setTimeout(() => {
        setAccountSettingsState(AccountSettingsState.AccountSettings);
      }, 4000);
    } catch (e) {
      const error = getFirebaseErrorMessage(e as FirebaseError);
      setValidationResult({
        ...validationResult,
        currentPassword: { error },
      });
    }
  }

  return (
    <Card className={`${CardStyles.account.updates} flex-nowrap`}>
      <Container
        className={`${ContainerStyles.NoSpacing} ${styles.container} p-0`}
      >
        <Toast
          className={`${
            ToastStyle.accountToast
          } m-auto position-absolute d-flex justify-content-center ${
            toastVisible == true ? opacity : ""
          }`}
          fade={toastVisible == true}
          isOpen={toastVisible}
        >
          <img
            className="align-self-center"
            src="img/check-circle.svg"
            alt="checkmark icon"
            width={Spacing.xLarge}
            height={Spacing.xLarge}
          />
          <ToastBody className="text-center">
            {ToastStrings.passwordUpdated}
          </ToastBody>
        </Toast>
        <Row className="mb-3">
          <Col>
            <h1 className={Fonts.Headline}>{strings.title}</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form>
              {/* *********** CURRENT PASSWORD ********** */}
              <FormGroup>
                <Label
                  for="currentPassword"
                  className={`fw-bold ${Fonts.Labels}`}
                >
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

                  {eyeIconVisible.current && !isCurrentInvalid && (
                    <img
                      className="toggle-password align-self-center position-absolute m-1"
                      src={
                        !passwordVisible.current
                          ? "img/icon-password-show.svg"
                          : "img/icon-password-hide.svg"
                      }
                      alt={
                        passwordVisible.current ? "open eye" : "eye with slash"
                      }
                      width="24px"
                      height="24px"
                      onClick={() =>
                        setPasswordVisible({
                          ...passwordVisible,
                          current: !passwordVisible.current,
                        })
                      }
                    />
                  )}
                </div>
              </FormGroup>

              {/* ***********NEW PASSWORD ********** */}
              <FormGroup>
                <Label for="newPassword" className={`fw-bold ${Fonts.Labels}`}>
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
                  </div>

                  {eyeIconVisible.new && !isNewInvalid && (
                    <img
                      className="toggle-password align-self-center position-absolute m-1"
                      src={
                        !passwordVisible.new
                          ? "img/icon-password-show.svg"
                          : "img/icon-password-hide.svg"
                      }
                      alt={passwordVisible.new ? "open eye" : "eye with slash"}
                      width={Spacing.xLarge}
                      height={Spacing.xLarge}
                      onClick={() =>
                        setPasswordVisible({
                          ...passwordVisible,
                          new: !passwordVisible.new,
                        })
                      }
                    />
                  )}
                </div>
                {!isNewInvalid && (
                  <PasswordRules
                    rules={
                      (validationResult && validationResult.passwordRules) || []
                    }
                    className="mt-3"
                  />
                )}
              </FormGroup>

              {/* *********** CONFIRM PASSWORD ********** */}
              <FormGroup>
                <Label
                  for="confirmPassword"
                  className={`fw-bold ${Fonts.Labels}`}
                >
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

                  {eyeIconVisible.confirm && !isConfirmInvalid && (
                    <img
                      className="toggle-password align-self-center position-absolute m-1"
                      src={
                        !passwordVisible.confirm
                          ? "img/icon-password-show.svg"
                          : "img/icon-password-hide.svg"
                      }
                      alt={
                        passwordVisible.confirm ? "open eye" : "eye with slash"
                      }
                      width="24px"
                      height="24px"
                      onClick={() =>
                        setPasswordVisible({
                          ...passwordVisible,
                          confirm: !passwordVisible.confirm,
                        })
                      }
                    />
                  )}
                </div>
              </FormGroup>
            </Form>
          </Col>
        </Row>

        <Row className="d-flex justify-content-between align-items-center flex-row-reverse">
          <Col className={`${ColumnStyles.account.buttonCol} col-auto`}>
            <Button
              className={`fw-bold ps-4 pe-4 pt-2 pb-2 ${
                isDisabled ? DisabledProductButton : ProductButton
              }`}
              outline
              disabled={isDisabled}
              onClick={() => validateAndUpdate()}
            >
              {strings.update}
            </Button>

            <Button
              className={`fw-bold ps-4 pe-4 pt-2 pb-2 me-3 ${TertiaryButton}`}
              outline
              onClick={() =>
                setAccountSettingsState(AccountSettingsState.AccountSettings)
              }
            >
              {strings.cancel}
            </Button>
          </Col>

          <Col className={`col-auto ${ColumnStyles.account.forgotPWCol}`}>
            <Button className={`fw-bold p-0 ${TransparentButton}`} outline>
              {strings.forgot}
            </Button>
          </Col>
        </Row>
      </Container>
    </Card>
  );
}

const styles = {
  acctCard: style(
    createResponsiveStyle(ScreenSize.ExtraSmall, {
      border: "none",
    })
  ),
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
