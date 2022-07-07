import { UserDemographicsData } from "@mozilla/rally-shared-types";
import { HTMLAttributes } from "react";
import { Col, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { InputControl } from "../../InputControl";
import { useProfileData } from "./ProfileDataContext";
import { StandardProfileSection } from "./StandardProfileSection";

const strings = Strings.components.pages.profile.age;

export function ProfileAge({
  children, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { profileData, setProfileData } = useProfileData();

  const age = profileData && profileData.age;

  return (
    <Row {...rest}>
      <Col>
        <fieldset id="age">
          <StandardProfileSection
            title={strings.title}
            onDataCleared={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { age, ...rest } = profileData;
              const newProfile = { ...rest } as UserDemographicsData;
              setProfileData(newProfile);
            }}
            isValuePresent={Boolean(age)}
            enableTwoColumnLayout={true}
          >
            {strings.options.map(({ title, value }) => (
              <InputControl
                title={title}
                name="age"
                checked={age === value}
                className="me-3"
                type="radio"
                onChange={() => {
                  setProfileData({
                    ...(profileData || {}),
                    age: value,
                  } as UserDemographicsData);
                }}
                key={value}
              />
            ))}
          </StandardProfileSection>
        </fieldset>
      </Col>
    </Row>
  );
}
