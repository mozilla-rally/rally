import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { useUserDocument } from "../../../services/UserDocumentService";
import { SecondaryButton, TertiaryButton } from "../../../styles/Buttons";
import { UserDocument } from "@mozilla/rally-shared-types/dist";
import { Button, Col, Row } from "reactstrap";

const strings = Strings.components.pages.privacyPolicy.buttons;

export function PrivacyPolicyButtons() {
	const { logout } = useAuthentication();
	const { updateUserDocument, userDocument } = useUserDocument();

	return (
		<Row className="g-0 bottom-0 start-0 w-100 py-2 bg-light position-fixed">
			<Col className="d-flex justify-content-center">
				<Button
					className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${SecondaryButton} me-3`}
					onClick={() =>
						updateUserDocument({
							...((userDocument || {}) as UserDocument),
							enrolled: true,
						})
					}
				>
					{strings.initial.acceptAndEnroll}
				</Button>
				<Button
					className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${TertiaryButton}`}
					outline
					onClick={() => logout()}
				>
					{strings.initial.decline}
				</Button>
			</Col>
		</Row>
	);
}
