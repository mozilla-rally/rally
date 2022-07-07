import { UserDemographicsData } from "@mozilla/rally-shared-types";
import { HTMLAttributes } from "react";
import { Col, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { InputControl } from "../../InputControl";
import { useProfileData } from "./ProfileDataContext";
import { StandardProfileSection } from "./StandardProfileSection";

const strings = Strings.components.pages.profile.hispanic;

export function ProfileHispanicBackground({
  children, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { profileData, setProfileData } = useProfileData();

  const hispanicLatinxSpanishOrigin =
    profileData && profileData.hispanicLatinxSpanishOrigin;

  return (
    <Row {...rest}>
      <Col>
        <fieldset id="hispanic">
          <StandardProfileSection
            title={strings.title}
            onDataCleared={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { hispanicLatinxSpanishOrigin, ...rest } = profileData;
              const newProfile = { ...rest } as UserDemographicsData;
              setProfileData(newProfile);
            }}
            isValuePresent={Boolean(hispanicLatinxSpanishOrigin)}
            enableTwoColumnLayout={false}
          >
            {strings.options.map(({ title, value }) => (
              <InputControl
                title={title}
                name="hispanic"
                type="radio"
                checked={hispanicLatinxSpanishOrigin === value}
                className="me-3"
                key={value}
                onChange={() => {
                  setProfileData({
                    ...(profileData || {}),
                    hispanicLatinxSpanishOrigin: value,
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
