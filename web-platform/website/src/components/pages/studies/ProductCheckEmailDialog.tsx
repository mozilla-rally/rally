import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { Spacing } from "../../../styles";
import { FontSize, Fonts } from "../../../styles/Fonts";
import { LinkStyles } from "../../../styles/LinkStyles";
import { Highlighter } from "../../Highlighter";

const strings = Strings.components.pages.studies.alerts.verifyEmail.modal;

export function ProductCheckEmailDialog() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Modal isOpen={isOpen} className={styles.modal}>
      <ModalBody>
        <Card className="border-0">
          <Container className="p-0">
            <Row className="card-top">
              <Col className="d-flex justify-content-end">
                <Button
                  onClick={async () => {
                    setIsOpen(false);
                  }}
                >
                  <img
                    className="close-icon"
                    src={strings.close}
                    alt="x icon"
                    width="24px"
                    height="24px"
                  />
                </Button>
              </Col>
            </Row>
            <Row className="m-0 p-0">
              <Col className="d-flex justify-content-center">
                <Highlighter>
                  <h1 className={Fonts.Headline}>{strings.title}</h1>
                </Highlighter>
              </Col>
            </Row>

            <Row className="w-100 p-0 m-0">
              <Col>
                <div className="img-wrapper m-auto d-flex justify-content-center">
                  <img
                    className="email-img"
                    src={strings.img}
                    alt="email image"
                    width="100%"
                    height="100%"
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col className="d-flex justify-content-center">
                <p
                  className={`text-center content-text ${Fonts.MediumBodySM} ${FontSize.Large}`}
                >
                  {strings.text}
                </p>
              </Col>
            </Row>

            <Row>
              <Col className="d-flex justify-content-center">
                <p className="text-center pe-1">{strings.help}</p>

                <a
                  href={strings.link.address}
                  className={`text-center ${LinkStyles.Underline}`}
                >
                  <b>{strings.link.text}</b>
                </a>
              </Col>
            </Row>
          </Container>
        </Card>
      </ModalBody>
    </Modal>
  );
}

const styles = {
  modal: style({
    width: 432,
    $nest: {
      ".card-top": {
        height: 36,
        padding: `0px 0px ${Spacing.Medium}px`,
      },

      ".btn": {
        backgroundColor: "transparent",
        border: "none",
      },

      ".modal-body": {
        padding: "20px 32px 44px",
      },

      ".img-wrapper": {
        width: 153,
      },
    },
  }),
};
