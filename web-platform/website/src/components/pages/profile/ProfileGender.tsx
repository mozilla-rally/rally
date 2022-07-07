import { UserDemographicsData } from "@mozilla/rally-shared-types";
import { HTMLAttributes } from "react";
import { Col, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { InputControl } from "../../InputControl";
import { useProfileData } from "./ProfileDataContext";
import { StandardProfileSection } from "./StandardProfileSection";

const strings = Strings.components.pages.profile.gender;

export function ProfileGender({
  children, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { profileData, setProfileData } = useProfileData();

  const gender = profileData && profileData.gender;

  return (
    <Row {...rest}>
      <Col>
        <fieldset id="gender">
          <StandardProfileSection
            title={strings.title}
            onDataCleared={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { gender, ...rest } = profileData;
              const newProfile = { ...rest } as UserDemographicsData;
              setProfileData(newProfile);
            }}
            isValuePresent={Boolean(gender)}
            enableTwoColumnLayout={true}
          >
            {strings.options.map(({ title, value }) => (
              <InputControl
                title={title}
                name="gender"
                type="radio"
                checked={gender === value}
                className="me-3"
                key={value}
                onChange={() => {
                  setProfileData({
                    ...(profileData || {}),
                    gender: value,
                  } as UserDemographicsData);
                }}
              />
            ))}
          </StandardProfileSection>
        </fieldset>
      </Col>
    </Row>
  );
}
