/**
 * A derived store that gives the number of profileQuestionsAnswered and totalProfileQuestions as a function of
 * the user's profile information in the application store.
 * @usage in a Svelte component, you should be able to subscribe to this store as such:
 * > {$profileCompletionStatus.profileQuestionsAnswered} / {$profileCompletionStatus.totalProfileQuestions}
 */
import { derived } from "svelte/store";
import { store } from "./app-store";
import {
  schema as demographicsSchema,
  inputFormatters,
} from "../views/profile/survey-schema";
import { formatAnswersForDisplay } from "../views/profile/formatters";
import { questionIsAnswered } from "../views/profile/survey-tools";

export interface ProfileCompletionStatus {
  profileQuestionsAnswered: number;
  totalProfileQuestions: number;
}

export function profileCompletionStatusCallback(
  state
): ProfileCompletionStatus {
  const formattedDemographicsData = state?.user?.demographicsData
    ? formatAnswersForDisplay(
        demographicsSchema,
        { ...state.user.demographicsData },
        inputFormatters
      )
    : undefined;
  const profileQuestionsAnswered = formattedDemographicsData
    ? Object.keys(demographicsSchema).filter((key) =>
        questionIsAnswered(
          formattedDemographicsData[key],
          demographicsSchema[key].type
        )
      ).length
    : 0;
  const totalProfileQuestions = Object.keys(demographicsSchema).length;
  return { profileQuestionsAnswered, totalProfileQuestions };
}

export default derived(store, profileCompletionStatusCallback, {
  profileQuestionsAnswered: 0,
  totalProfileQuestions: 7,
});
