import { Flags } from "../../../resources/Flags";
import { useFlagService } from "../../../services/FlagService";
import { Fonts } from "../../../styles/Fonts";
import { Col, Container, Row } from "reactstrap";

export interface StandardPrivacyPolicySectionProps {
	title: string;
	tagline: string;
	sections: {
		image?: { url: string; width: number; alt: string };
		text: string | JSX.Element;
	}[];
}

export function StandardPrivacyPolicySection({
	title,
	tagline,
	sections,
}: StandardPrivacyPolicySectionProps) {
	const { isFlagActive } = useFlagService();
	const isV2Enabled = isFlagActive(Flags.onboardingV2.name);

	return (
		<>
			<Row>
				<Col>
					<h2 className={`${Fonts.Headline}`}>{title}</h2>
				</Col>
			</Row>
			<Row className={`${!isV2Enabled ? "mb-4" : ""}`}>
				<Col>
					<p>{tagline}</p>
				</Col>
			</Row>
			<Row className={`${!isV2Enabled ? "mb-4" : ""}`}>
				<Col>
					<Container className="p-0 g-5">
						{sections.map(({ image, text }, i) => (
							<Row
								className={`d-flex align-items-center ${
									!isV2Enabled ? "mb-4" : ""
								}`}
								key={i}
							>
								{!isV2Enabled && image && (
									<Col className="col-12 col-sm-2 mb-4 text-center">
										<img
											width={image.width}
											src={image.url}
											alt={image.alt}
										></img>
									</Col>
								)}
								<Col>{text}</Col>
							</Row>
						))}
					</Container>
				</Col>
			</Row>
		</>
	);
}
