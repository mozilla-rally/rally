export interface Flag {
  name: string;
  description: string;
  defaultValue: boolean;
}

export const Flags: Record<string, Flag> = {
  onboardingV2: {
    name: "onboardingV2",
    description: "Enables new onboarding experience.",
    defaultValue: true,
  },
};
