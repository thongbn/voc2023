import React, {useEffect, useState} from "react";
import {Form, Input, Select, Switch} from "antd";
import {useSelector} from "react-redux";

const FaqButtonForm = (props) => {
  const {form} = props;
  const buttonTypes = useState([]);

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
      name="title"
      label="Title"
      rules={[
        {
          required: true,
          message: 'Please input Title',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="title_en"
      label="Title Eng"
      rules={[
        {
          required: true,
          message: 'Please input Title in English',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="icon"
      label="Icon"
      rules={[
        {
          required: true,
          message: 'Please input icon name',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="buttonType"
      label="Type"
      rules={[
        {
          required: true,
          message: 'Please input Type',
        },
      ]}
    >
      <Select>
        {buttonTypes.map(item => <Select.Option value={item.value}>{item.name}</Select.Option>)}
      </Select>
    </Form.Item>
    <Form.Item
      name="sort"
      label={"Sort Order"}
    >
      <Input type={"number"} />
    </Form.Item>
  </Form>)
};

export default FaqButtonForm;
