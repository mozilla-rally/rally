export interface Flag {
	name: string;
	description: string;
}

export const Flags: Record<string, Flag> = {
	onboardingV2: {
		name: "onboardingV2",
		description: "Enables new onboarding experience.",
	},
	privacyV2: {
		name: "privacyV2",
		description: "Enables new privacy modal",
	},
};
