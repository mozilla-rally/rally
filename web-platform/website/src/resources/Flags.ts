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

  isLoginDisabled: {
    name: "isLoginDisabled",
    description: "Disables login for users as Rally is decommissioned.",
    defaultValue: true,
  },
};
