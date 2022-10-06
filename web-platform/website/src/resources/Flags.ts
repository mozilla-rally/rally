import { Flag } from "../services/Flag";

export const Flags: Record<string, Flag> = {
  onboardingV2: {
    name: "onboardingV2",
    description: "Enables new onboarding experience.",
    defaultValue: false,
  },
};
