export interface Flag {
  name: string;
  description: string;
  defaultValue: boolean;
}

export const Flags: Record<string, Flag> = {
  /* Example:
  onboardingV2: {
    name: "onboardingV2",
    description: "Enables new onboarding experience.",
    defaultValue: false,
  },*/

  HomepageV2: {
    name: "HomepageV2",
    description: "Enables new homepage experience.",
    defaultValue: false,
  },
};
