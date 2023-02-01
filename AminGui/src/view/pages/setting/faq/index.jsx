import React from "react";
import FaqCategories from "./FaqCategories";
import {Col, Row} from "antd";
import FaqButtons from "./FaqButtons";
import FaqList from "./FaqList";

const Faq = () => {
  return (<>
    <FaqCategories />
    <Row>
      <Col xs={24} md={8}>
        <FaqButtons />
      </Col>
      <Col xs={24} md={16}>
        <FaqList />
      </Col>
    </Row>
  </>)
};

export default Faq;
