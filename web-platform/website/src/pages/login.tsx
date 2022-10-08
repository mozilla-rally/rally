import { Layout } from "../components/Layout";
import { LoginPageContent } from "../components/pages/login/LoginPageContent";
import { LoginPageContentV2 } from "../components/pages/login/LoginPageContentV2";
import { Flags } from "../resources/Flags";
import { Strings } from "../resources/Strings";
import { useAuthentication } from "../services/AuthenticationService";
import { useFlagService } from "../services/FlagService";
import { useStudies } from "../services/StudiesService";
import {
	ApplyFullscapePageStyles,
	ScreenSize,
	createResponsiveStyle,
} from "../styles";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { style } from "typestyle";

const strings = Strings.pages.login;

const LoginPage: NextPage = () => {
	const { isLoaded, user } = useAuthentication();
	const router = useRouter();
	const { isFlagActive } = useFlagService();
	const { installedStudyIds } = useStudies();

	if (!isLoaded || !router.isReady) {
		return null;
	}

	if (isFlagActive(Flags.onboardingV2)) {
		if (user && installedStudyIds.length > 0) {
			router.replace("/");
			return null;
		}
	} else if (user) {
		router.replace("/");
		return null;
	}

	if (isFlagActive(Flags.onboardingV2)) {
		return (
			<LoginPageContentV2>
				<Head>
					<title>{strings.title}</title>
				</Head>
			</LoginPageContentV2>
		);
	}

	return (
		<Layout>
			<>
				<Head>
					<title>{strings.title}</title>
				</Head>
				<div className={styles.signBackground}>
					<LoginPageContent />
				</div>
			</>
		</Layout>
	);
};

ApplyFullscapePageStyles();

const styles = {
	signBackground: style(
		{
			backgroundImage: "none",
		},
		createResponsiveStyle(
			ScreenSize.Medium,
			{
				width: "100%",
				height: "100vh",
				background: "no-repeat",
				backgroundImage: `url("/img/network-background.png")`,
				backgroundPosition: "right top",
			},
			true
		)
	),
};

export default LoginPage;
