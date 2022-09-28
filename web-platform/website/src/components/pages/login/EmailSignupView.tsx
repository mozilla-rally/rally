import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { Spacing } from "../../../styles";
import { Colors } from "../../../styles";
import { PrimaryButton } from "../../../styles/Buttons";
import { Fonts, FontSize } from "../../../styles/Fonts";
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
import { style } from "typestyle";

const strings = Strings.components.pages.login.emailSignupView;
const passwordErrorStrings = Strings.utils.passwordErrorMessages;
const launchStrings = Strings.components.pages.login.initialLoginView;

export function EmailSignupView() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [eyeIconVisible, setEyeIconVisible] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
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

	const { signupWithEmail, logout } = useAuthentication();
	const { setLoginState } = useLoginDataContext();

	async function validateAndSignup() {
		setValidationResult(undefined);

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
			return;
		}

		try {
			await signupWithEmail(emailRef.current, passwordRef.current);
			await logout();
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
				<Col className="d-flex justify-content-start">
					<Highlighter className="highlight-launch">
						<h1 className={`${Fonts.Headline} ${styles.title}`}>
							{launchStrings.launch.extensionTrue.title}
						</h1>
					</Highlighter>
				</Col>
			</Row>
			<Row className="mb-4">
				<Col>
					<h5
						className={`${FontSize.Large} ${Fonts.MediumBodySM} ${styles.subTitle}`}
					>
						{launchStrings.launch.extensionTrue.subTitle}
					</h5>
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
							<div className="d-flex flex-row-reverse">
								<Input
									id="password"
									type={passwordVisible ? "text" : "password"}
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

								{eyeIconVisible && !isPasswordInvalid && !isEmailInvalid && (
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
			<Row className="mb-4">
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

const styles = {
	title: style({
		width: "calc(472px * .7)",
		textAlign: "left",
		lineHeight: `${Spacing.xxxLarge}px`,
	}),
	subTitle: style({
		lineHeight: `${Spacing.xLarge + 4}px`,
		color: Colors.ColorMarketingGray70,
	}),
};
