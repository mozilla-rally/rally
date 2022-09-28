import { Strings } from "../../../resources/Strings";
import { createResponsiveStyle } from "../../../styles/ResponsiveStyle";
import { ScreenSize } from "../../../styles/ScreenSize";
import { Spacing } from "../../../styles/Spacing";
import { LoginState, useLoginDataContext } from "./LoginDataContext";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

const strings = Strings.components.pages.login.privacyNoticeAndLoginLink;

export function PrivacyNoticeAndLoginLink() {
	const { setLoginState } = useLoginDataContext();

	return (
		<Container className={`${styles.container} p-0`}>
			<Row className="justify-content-center g-0">
				<Col className="d-flex justify-content-center col-auto me-1">
					{strings.accountExists}
				</Col>
				<Col className="col-auto">
					<a
						href="#"
						className="fw-bold"
						onClick={() => setLoginState(LoginState.Login)}
					>
						{strings.signIn}
					</a>
				</Col>
			</Row>
		</Container>
	);
}

const styles = {
	container: style({
		$nest: {
			".privacy-notice": createResponsiveStyle(ScreenSize.ExtraSmall, {
				marginBottom: `${Spacing.xLarge}px !important`,
			}),
		},
	}),
};
