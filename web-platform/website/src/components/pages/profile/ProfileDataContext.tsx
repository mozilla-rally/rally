import { UserDemographicsData } from "@mozilla/rally-shared-types";
import assert from "assert";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useUserDocument } from "../../../services/UserDocumentService";

export interface ProfileDataContext {
  profileData: UserDemographicsData;
  setProfileData: (newProfileData: UserDemographicsData) => void;
  addValidator(validator: () => boolean): () => void;
  isValid: boolean;
}

const ProfileContext = createContext<ProfileDataContext>(
  {} as ProfileDataContext
);

export function useProfileData() {
  return useContext(ProfileContext);
}

export function ProfileDataProvider(props: { children: React.ReactNode }) {
  const { isDocumentLoaded, userDocument } = useUserDocument();

  const [profileData, setProfileData] = useState(
    (userDocument && userDocument.demographicsData) ||
      ({} as UserDemographicsData)
  );

  const [isValid, setIsValid] = useState<boolean>(false);

  const [validators] = useState(new Set<() => boolean>());

  useEffect(() => {
    setProfileData(
      (userDocument && userDocument.demographicsData) ||
        ({} as UserDemographicsData)
    );
  }, [userDocument]);

  function addValidator(validator: () => boolean): () => void {
    assert(validator && typeof validator === "function", "Invalid validator");

    validators.add(validator);

    validateAll();

    return () => {
      validators.delete(validator);
      validateAll();
    };
  }

  const validateAll = useCallback(() => {
    let isValid = true;

    validators.forEach((validator) => {
      if (!validator()) {
        isValid = false;
        return;
      }
    });

    setIsValid(isValid);
  }, [validators]);

  useEffect(() => {
    validateAll();
  }, [profileData, validateAll]);

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        setProfileData,
        addValidator,
        isValid,
      }}
    >
      {isDocumentLoaded ? props.children : null}
    </ProfileContext.Provider>
  );
}
