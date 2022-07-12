import { UserDemographicsData } from "@mozilla/rally-shared-types";
import { RaceType } from "@mozilla/rally-shared-types/dist";
import { HTMLAttributes } from "react";
import { Col, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { InputControl } from "../../InputControl";
import { useProfileData } from "./ProfileDataContext";
import { StandardProfileSection } from "./StandardProfileSection";

const strings = Strings.components.pages.profile.ethnicity;

export function ProfileEthnicity({
  children, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { profileData, setProfileData } = useProfileData();

  const race: RaceType[] =
    ((profileData && profileData.race) as RaceType[]) || [];

  return (
    <Row {...rest}>
      <Col>
        <fieldset id="ethnicity">
          <StandardProfileSection
            title={strings.title}
            onDataCleared={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { race, ...rest } = profileData;
              const newProfile = { ...rest } as UserDemographicsData;
              setProfileData(newProfile);
            }}
            isValuePresent={Boolean(race && race.length)}
            enableTwoColumnLayout={true}
          >
            {strings.options.map(({ title, value }) => (
              <InputControl
                title={title}
                name="ethnicity"
                type="checkbox"
                checked={race.includes(value as RaceType)}
                className="me-3"
                key={value}
                value={value}
                onChange={(event) => {
                  if (event.target.checked) {
                    race.push(value as RaceType);
                  } else {
                    race.splice(race.indexOf(value as RaceType), 1);
                  }

                  setProfileData({ ...(profileData || {}), race });
                }}
              />
            ))}
          </StandardProfileSection>
        </fieldset>
      </Col>
    </Row>
  );
}
