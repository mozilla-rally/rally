import { Strings } from "../../../resources/Strings";
import { Spacing, Colors } from "../../../styles";
import { Fonts, FontSizeRaw } from "../../../styles/Fonts";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

const strings = Strings.components.pages.login.getExtensionView;
const loginStrings = Strings.components.pages.login.loginPageContentV2;

export function ValuePropositionNoExtension() {
	return (
		<Container>
			<Row>
				<Col>
					<div
						className={`${Fonts.Headline} ${styles.headline} tagline font-weight-bold mb-4 text-center`}
					>
						{strings.valueProp.title}
					</div>
				</Col>
			</Row>

			<Row>
				<Col>
					<ul className={styles.tips}>
						{strings.valueProp.valueProps.map((tip) => {
							return (
								<li className="tips-box d-flex flex-column align-items-center">
									<div className="text-center d-flex justify-content-center align-items-center tips-ellipse">
										<div className="text-center tips-icon">{tip.valueIcon}</div>
									</div>

									<div
										className={`tips-text text-center ${Fonts.MediumBodySM}`}
									>
										{tip.valueText}
									</div>
								</li>
							);
						})}
					</ul>
				</Col>
			</Row>
		</Container>
	);
}

export function ValuePropositionInitial() {
	return (
		<Container>
			<Row>
				<Col>
					<div className={`${Fonts.Headline} tagline font-weight-bold mb-4`}>
						{loginStrings.valuePropositions.default.tagline}
					</div>

					<img
						src="/img/illustration-group-rally.png"
						alt="a group of people with flags"
					/>
				</Col>
			</Row>
		</Container>
	);
}

const styles = {
	headline: style({
		padding: `0px ${Spacing.Micro * 7}px`,
		color: Colors.ColorMarketingGray70,
		lineHeight: "26px",
	}),
	tips: style({
		listStyle: "none",
		$nest: {
			".tips-box": {
				marginTop: `${Spacing.xLarge}px`,
			},
			".tips-ellipse": {
				border: `4px solid ${Colors.ColorLightBlue}`,
				height: "78px",
				width: "78px",
				borderRadius: "50%",
			},
			".tips-icon": {
				color: Colors.ColorLightBlue,
				fontSize: `${Spacing.xLarge}px`,
			},
			".tips-text": {
				...FontSizeRaw.Small,
				padding: `0 ${Spacing.xLarge}px`,
				color: Colors.ColorMarketingGray70,
				lineHeight: "21px",
				marginTop: `${Spacing.Small}px`,
			},
		},
	}),
};
