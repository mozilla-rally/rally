import { Col, Container, Row } from "reactstrap";
import { Strings } from "../../../resources/Strings";
import { Fonts } from "../../../styles/Fonts";
import { Highlighter } from "../../Highlighter";


const strings = Strings.components.pages.accountSettings.emailChanged

interface Email {
  email:string
}

export function EmailChangedView(props:Email) {

  const { email } = props

  const message = strings.message.replace("{email}", email)


  return (
    <Container className={`p-0`}>
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <Highlighter>
            <h1 className={Fonts.Headline}>{strings.title}</h1>
          </Highlighter>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <span className="text-center">{message}</span>
        </Col>
      </Row>
    </Container>
  );
}
