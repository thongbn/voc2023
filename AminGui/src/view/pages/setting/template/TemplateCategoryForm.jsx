import React, {useEffect, useState} from "react";
import {Form, Input, Select, Switch, Tag} from "antd";
import {useSelector} from "react-redux";

const TemplateCategoryForm = (props) => {
  const {form} = props;
  const tagColors = useState([]);
  useEffect(() => {

  }, []);

  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 8},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 16},
    },
  };

  return (<Form {...formItemLayout} form={form}>
    <Form.Item
      name="name"
      label="Name"
      rules={[
        {
          required: true,
          message: 'Please input your Name',
        },
      ]}
    >
      <Input />
    </Form.Item>
  </Form>)
};

export default TemplateCategoryForm;
