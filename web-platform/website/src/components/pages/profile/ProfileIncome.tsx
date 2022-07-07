import { UserDemographicsData } from "@mozilla/rally-shared-types";
import { HTMLAttributes, useRef } from "react";
import { Col, Container, Input, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { CurrencyFormatter, useFormatter } from "../../InputValueFormatters";
import { useProfileData } from "./ProfileDataContext";
import { StandardProfileSection } from "./StandardProfileSection";

const strings = Strings.components.pages.profile.income;

export function ProfileIncome({
  children, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { profileData, setProfileData } = useProfileData();

  const inputRef = useRef<HTMLInputElement>(null);

  useFormatter(inputRef, CurrencyFormatter);

  const exactIncome = profileData && profileData.exactIncome;

  return (
    <Row {...rest}>
      <Col>
        <fieldset id="exactIncome">
          <StandardProfileSection
            title={strings.title}
            onDataCleared={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { exactIncome, ...rest } = profileData;
              const newProfile = { ...rest } as UserDemographicsData;
              setProfileData(newProfile);
            }}
            isValuePresent={Boolean(exactIncome !== undefined)}
            enableTwoColumnLayout={false}
          >
            <Container className="p-0">
              <Row className="mb-2">
                <Col>{strings.tagline}</Col>
              </Row>
              <Row>
                <Col>
                  <Input
                    type="text"
                    style={{ width: "unset" }}
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    innerRef={inputRef}
                    value={exactIncome || ""}
                    onInput={(event) => {
                      const value =
                        event &&
                        event.target &&
                        (event.target as HTMLInputElement).value;
                      const intValue = parseInt(value, 10);

                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      const { exactIncome, ...rest } = profileData || {
                        exactIncome: "",
                      };

                      setProfileData(
                        Number.isInteger(intValue)
                          ? {
                              ...(profileData || {}),
                              exactIncome: intValue,
                            }
                          : ({ ...rest } as UserDemographicsData)
                      );
                    }}
                  />
                </Col>
              </Row>
            </Container>
          </StandardProfileSection>
        </fieldset>
      </Col>
    </Row>
  );
}
