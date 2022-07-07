import { UserDemographicsData } from "@mozilla/rally-shared-types";
import assert from "assert";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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

export function ProfileDataProvider(props: {
  children: React.ReactNode;
  initialProfileData?: UserDemographicsData | null;
}) {
  const [profileData, setProfileData] = useState<UserDemographicsData>(
    props.initialProfileData || ({} as UserDemographicsData)
  );

  const [isValid, setIsValid] = useState<boolean>(false);

  const [validators] = useState(new Set<() => boolean>());

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
      {props.children}
    </ProfileContext.Provider>
  );
}
