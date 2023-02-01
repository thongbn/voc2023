import React from "react";
import TemplateCategories from "./TemplateCategories";
import Templates from "./Templates";
import {Space} from "antd";

const AnswerTemplate = () => {
  return (<Space direction={"vertical"}>
    <TemplateCategories/>
    <Templates/>
  </Space>)
};

export default AnswerTemplate;
