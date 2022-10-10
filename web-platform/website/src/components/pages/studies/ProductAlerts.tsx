import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { Spacing, Colors } from "../../../styles";
import { ProductButton } from "../../../styles/Buttons";
import { useEffect, useState } from "react";
import { Col, Container, Row, Alert, Button } from "reactstrap";
import { style } from "typestyle";

const verifyEmailStrings = Strings.components.alerts.verifyEmail;

export function ProductAlerts() {
	const [showEmailNotVerifiedToast, setShowEmailNotVerifiedToast] =
		useState(false);

	const { isUserVerified, user } = useAuthentication();

	useEffect(() => {
		if (user && user.firebaseUser && !isUserVerified) {
			setShowEmailNotVerifiedToast(true);
		}
	}, [isUserVerified, user]);

	return (
		<Container className={styles.container}>
			{showEmailNotVerifiedToast && <VerifyEmailAlert />}
		</Container>
	);
}

function VerifyEmailAlert() {
	const { sendEmailVerification, logout } = useAuthentication();
	const [toastVisible, closeToast] = useState<boolean>(true);

	return (
		<Alert className="verify-email" isOpen={toastVisible}>
			<div className="d-flex align-items-center justify-content-between">
				<div className="left d-flex">
					<img
						className="warning-icon"
						src={verifyEmailStrings.icon}
						alt="warning icon"
					/>
					<div>{verifyEmailStrings.text}</div>
				</div>

				<div className="right d-flex align-items-center">
					<Button
						onClick={async () => {
							await sendEmailVerification();
							await logout();
						}}
						className={`${ProductButton} resend-btn`}
					>
						{verifyEmailStrings.button}
					</Button>

					<img
						onClick={() => closeToast(false)}
						className="close-icon"
						src={verifyEmailStrings.close}
						alt="x icon"
					/>
				</div>
			</div>
		</Alert>
	);
}

const styles = {
	container: style({
		position: "absolute",
		top: "12px",
		width: "1226px",
		$nest: {
			".verify-email": {
				backgroundColor: Colors.ColorYellow100,
			},
			".warning-icon": {
				marginRight: "6px",
			},
			".resend-btn": {
				marginRight: "6px",
			},
			".close-icon": {
				width: "24px",
				height: "24px",
				cursor: "pointer",
			},
		},
	}),
};
