import { Col, Container, Row } from "reactstrap";

import {
  ContainerStyles,
  FontSize,
  Fonts,
  LinkStyles,
} from "../../../../styles";

export interface NewsReportItem {
  date: string;
  content: React.ReactNode | string;
  source: string;
  title: string;
  type: string;
  url: string;
}

export interface ImageItem {
  imageUrl: string;
}

export type NewsItem = NewsReportItem | ImageItem;

export function NewsItem(item: NewsItem) {
  return (
    ((item as ImageItem).imageUrl && (
      <ImageNews {...(item as ImageItem)} />
    )) || <NewsReport {...(item as NewsReportItem)} />
  );
}

function ImageNews(item: ImageItem) {
  return (
    <Container className={`${ContainerStyles.NoSpacing} pt-4 pb-4`}>
      <Row>
        <Col className={`${FontSize.xSmall} text-muted`}>
          <img
            src={item.imageUrl}
            style={{
              width: 450,
              height: 200,
              margin: "auto",
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}

function NewsReport(item: NewsReportItem) {
  return (
    <Container
      className={`${ContainerStyles.NoSpacing} border-bottom pb-4 pt-2 ps-lg-2 pe-lg-5`}
    >
      <Row>
        <Col className={`${FontSize.xSmall} text-muted`}>
          {item.source} - {item.date}
        </Col>
      </Row>
      <Row>
        <Col className={`${Fonts.Headline} ${FontSize.xLarge}`}>
          <a
            href={item.url}
            target="_blank"
            className={LinkStyles.NoUnderline}
            rel="noreferrer"
          >
            {item.title}
          </a>
        </Col>
      </Row>
      <Row>
        <Col>{item.content}</Col>
      </Row>
      <Row className={`${FontSize.xSmall} text-muted mt-3 d-flex`}>
        <Col>{item.type}</Col>
        <Col className="d-flex justify-content-end">
          <a href={item.url} target="_blank" rel="noreferrer">
            <img src="img/open-external.svg" className="ms-1 mb-1" alt="" />
          </a>
        </Col>
      </Row>
    </Container>
  );
}
