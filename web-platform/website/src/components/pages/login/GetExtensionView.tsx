import { Strings } from "../../../resources/Strings";
import { Spacing, Colors } from "../../../styles";
import { PrimaryButton, LinkButton } from "../../../styles/Buttons";
import { Fonts, FontSizeRaw } from "../../../styles/Fonts";
import { Highlighter } from "../../Highlighter";
import { LoginButton } from "./LoginButton";
import { useRouter } from "next/router";
import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

const strings = Strings.components.pages.login.getExtensionView;

export function GetExtensionView() {
	const router = useRouter();
	return (
		<Container className="p-0">
			<Row className="mb-3">
				<Col className="d-flex justify-content-center">
					<h1 className={Fonts.Headline}>{strings.title}</h1>
					<Highlighter>
						<h1 className={Fonts.Headline}>{strings.titleHighlight}</h1>
					</Highlighter>
				</Col>
			</Row>
			<Row className="mb-4">
				<Col>
					<h5 className={`${Fonts.MediumBodySM} ${styles.subTitle} text-left`}>
						{strings.subtitle}
					</h5>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<h5 className={`${Fonts.Title} ${styles.bulletTitle} text-left`}>
						{strings.bulletTitle}
					</h5>
					<ul>
						{strings.bullets.map((text) => {
							return <li>{text}</li>;
						})}
					</ul>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<LoginButton className={PrimaryButton}>{strings.getExt}</LoginButton>
				</Col>
			</Row>
			<Row className="mb-3">
				<Col>
					<LoginButton
						onClick={() => {
							router.push("/");
						}}
						className={LinkButton}
					>
						{strings.skip}
					</LoginButton>
				</Col>
			</Row>
		</Container>
	);
}

const styles = {
	subTitle: style({
		...FontSizeRaw.Large,
		lineHeight: `${Spacing.Micro * 7}px`,
	}),

	bulletTitle: style({
		...FontSizeRaw.Large,
		color: Colors.ColorMarketingGray70,
	}),
};
