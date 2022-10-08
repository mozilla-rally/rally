import { Flags } from "../../../resources/Flags";
import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { useFlagService } from "../../../services/FlagService";
import { useStudies } from "../../../services/StudiesService";
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

const strings = Strings.components.pages.login.emailSignupView;
const passwordErrorStrings = Strings.utils.passwordErrorMessages;

export function EmailSignupView() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { setLoginState } = useLoginDataContext();
	const [eyeIconVisible, setEyeIconVisible] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [validationResult, setValidationResult] =
		useState<LoginFormValidationResult>();
	const { installedStudyIds } = useStudies();

	const isEmailInvalid = Boolean(
		validationResult && validationResult.email && validationResult.email.error
	);

	const isPasswordInvalid = Boolean(
		validationResult &&
			validationResult.password &&
			validationResult.password.error
	);

	const { isFlagActive } = useFlagService();

	const isV2Enabled = isFlagActive(Flags.onboardingV2);

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
			if (installedStudyIds.length < 1 && isV2Enabled) {
				setLoginState(LoginState.GetExtension);
				localStorage.setItem("isExtensionView", "isExtensionView");
			}
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
			{!isV2Enabled && (
				<Row className="mb-4">
					<Col className="d-flex justify-content-center">
						<Highlighter>
							<h1 className={Fonts.Headline}>{strings.title}</h1>
						</Highlighter>
					</Col>
				</Row>
			)}
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
