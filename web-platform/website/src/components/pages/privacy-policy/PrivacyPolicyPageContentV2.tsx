import { Strings } from "../../../resources/Strings";
import { useUserDocument } from "../../../services/UserDocumentService";
import { Spacing } from "../../../styles";
import { SecondaryButton, TertiaryButton } from "../../../styles/Buttons";
import { Colors } from "../../../styles/Colors";
import { FullscapePageContainer } from "../../../styles/DocumentStyles";
import { Fonts, FontSizeRaw } from "../../../styles/Fonts";
import { createResponsiveStyle } from "../../../styles/ResponsiveStyle";
import { ScreenSize } from "../../../styles/ScreenSize";
import { PrivacyPolicyDataCollectionTypes } from "./PrivacyPolicyDataCollectionTypes";
import { PrivacyPolicyInformationUse } from "./PrivacyPolicyInformationUse";
import { PrivacyPolicyIntroduction } from "./PrivacyPolicyIntroduction";
import { PrivacyPolicyManageData } from "./PrivacyPolicyManageData";
import { PrivacyPolicySharing } from "./PrivacyPolicySharing";
import { UserDocument } from "@mozilla/rally-shared-types/dist";
import { Container, Modal, ModalHeader } from "reactstrap";
import { Button, Col, Row } from "reactstrap";
import { style } from "typestyle";
import { NestedCSSProperties } from "typestyle/lib/types";

const strings = Strings.components.pages.privacyPolicy;
const btnStrings = Strings.components.pages.privacyPolicy.buttons;

export function PrivacyPolicyPageContentV2(props: {
	closeModal: object;
	isOpen: boolean;
}) {
	const { updateUserDocument, userDocument } = useUserDocument();

	return (
		<Modal
			className={styles.modal}
			contentClassName={styles.modalContent}
			{...props}
		>
			<ModalHeader className={Fonts.Title}>{strings.modalHeader}</ModalHeader>
			<Container
				className={`${FullscapePageContainer} ${styles.modalContainer}`}
			>
				<PrivacyPolicyIntroduction />
				<hr />
				<PrivacyPolicyDataCollectionTypes />
				<hr />
				<PrivacyPolicyInformationUse />
				<hr />
				<PrivacyPolicySharing />
				<hr />
				<PrivacyPolicyManageData />
			</Container>

			<Row className="g-0 bottom-0 start-0 w-100 py-2">
				<Col className="d-flex justify-content-end flex-row-reverse align-items-center">
					<Button
						className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${SecondaryButton} me-3`}
						onClick={async () => {
							await updateUserDocument({
								...((userDocument || {}) as UserDocument),
								enrolled: true,
							});

							props && props.closeModal && (props.closeModal as () => void)();
						}}
					>
						{btnStrings.v2.agree}
					</Button>
					<Button
						className={`d-flex fw-bold ps-4 pe-4 pt-2 pb-2 ${TertiaryButton} ${styles.button}`}
						outline
						onClick={() => {
							props && props.closeModal && (props.closeModal as () => void)();
						}}
					>
						{btnStrings.v2.back}
					</Button>
				</Col>
			</Row>
		</Modal>
	);
}

const smallModalStyle: NestedCSSProperties = {
	width: "100%",
	margin: 0,
};

const styles = {
	button: style({
		marginRight: Spacing.Medium,
	}),
	modal: style(
		createResponsiveStyle(ScreenSize.ExtraSmall, smallModalStyle),
		createResponsiveStyle(ScreenSize.Small, smallModalStyle),
		{
			maxWidth: "unset",
			$nest: {
				".modal-header": {
					...FontSizeRaw.xLarge,
					borderBottom: "none",
					lineHeight: Spacing.xLarge,
					paddingBottom: Spacing.xxLarge,
					color: Colors.ColorDarkGray90,
				},
				".modal-title": {
					fontWeight: 700,
				},
			},
		}
	),
	modalContainer: style({
		backgroundColor: "#f0f0f4",
		width: 860,
		padding: Spacing.xLarge,
		maxHeight: 495,
		overflow: "auto",
		marginBottom: Spacing.xLarge,
		$nest: {
			h2: {
				color: Colors.ColorMarketingGray70,
			},
			p: {
				color: Colors.ColorMarketingGray70,
			},
		},
	}),
	modalContent: style(
		createResponsiveStyle(ScreenSize.Small, {
			width: "unset",
		}),
		{
			width: 852,
			maxHeight: 635,
			boxSizing: "content-box",
			maxWidth: "unset",
			padding: "20px 20px 48px",
			marginLeft: "auto",
			marginRight: "auto",
		}
	),
};
