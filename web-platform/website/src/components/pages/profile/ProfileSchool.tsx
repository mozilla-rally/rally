import { UserDemographicsData } from "@mozilla/rally-shared-types";
import { HTMLAttributes } from "react";
import { Col, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { InputControl } from "../../InputControl";
import { useProfileData } from "./ProfileDataContext";
import { StandardProfileSection } from "./StandardProfileSection";

const strings = Strings.components.pages.profile.school;

export function ProfileSchool({
  children, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { profileData, setProfileData } = useProfileData();

  const school = profileData && profileData.school;

  return (
    <Row {...rest}>
      <Col>
        <fieldset id="school">
          <StandardProfileSection
            title={strings.title}
            onDataCleared={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { school, ...rest } = profileData;
              const newProfile = { ...rest } as UserDemographicsData;
              setProfileData(newProfile);
            }}
            isValuePresent={Boolean(school)}
            enableTwoColumnLayout={false}
          >
            {strings.options.map(({ title, value }) => (
              <InputControl
                title={title}
                name="school"
                checked={school === value}
                className="me-3"
                type="radio"
                onChange={() => {
                  setProfileData({
                    ...(profileData || {}),
                    school: value,
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
