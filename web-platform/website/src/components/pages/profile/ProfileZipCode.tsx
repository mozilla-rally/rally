import { UserDemographicsData } from "@mozilla/rally-shared-types";
import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Col, Container, Input, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { FontSize } from "../../../styles/Fonts";
import { NumberFormatter, useFormatter } from "../../InputValueFormatters";
import { useProfileData } from "./ProfileDataContext";
import { StandardProfileSection } from "./StandardProfileSection";

const strings = Strings.components.pages.profile.zipCode;

const validZipCodeRegEx = /^\d{5}(-\d{4})?$/;

export function ProfileZipCode({
  children, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { profileData, setProfileData, addValidator } = useProfileData();

  const [isValid, setIsValid] = useState(true);

  const zipCode = profileData && profileData.zipcode;

  const isZipCodeValid = useCallback(() => {
    const isZipCodeValid =
      zipCode === undefined ||
      (Number.isFinite(parseInt(zipCode, 10)) &&
        validZipCodeRegEx.test(zipCode.toString()));

    return isZipCodeValid;
  }, [zipCode]);

  const inputRef = useRef<HTMLInputElement>(null);

  useFormatter(inputRef, NumberFormatter);

  useEffect(() => addValidator(isZipCodeValid), [zipCode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Row {...rest}>
        <Col>
          <fieldset id="zipCode">
            <StandardProfileSection
              title={strings.title}
              onDataCleared={() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { zipcode, ...rest } = profileData;
                const newProfile = { ...rest } as UserDemographicsData;
                setProfileData(newProfile);
              }}
              isValuePresent={Boolean(zipCode !== undefined)}
              enableTwoColumnLayout={false}
            >
              <Container className="p-0">
                <Row>
                  <Col>
                    <Input
                      type="text"
                      style={{ width: "unset" }}
                      innerRef={inputRef}
                      value={zipCode || ""}
                      onFocus={() => {
                        setIsValid(true);
                      }}
                      onBlur={() => {
                        setIsValid(isZipCodeValid());
                      }}
                      onInput={(event) => {
                        const value =
                          event &&
                          event.target &&
                          (event.target as HTMLInputElement).value;

                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { zipcode, ...rest } = profileData || {
                          zipcode: "",
                        };

                        setProfileData(
                          value
                            ? {
                                ...(profileData || {}),
                                zipcode: value,
                              }
                            : ({ ...rest } as UserDemographicsData)
                        );
                      }}
                    />
                    {!isValid && (
                      <div className={`${FontSize.Small} text-danger`}>
                        {strings.invalidZipCode}
                      </div>
                    )}
                  </Col>
                </Row>
              </Container>
            </StandardProfileSection>
          </fieldset>
        </Col>
      </Row>
      <Row>
        <Col>
          <hr />
        </Col>
      </Row>
    </>
  );
}
