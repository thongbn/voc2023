import React, {useEffect} from "react";
import {Form, Input, Switch} from "antd";

const FaqCategoryForm = (props) => {
  const {form} = props;
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
          message: 'Please input Category Name',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item name="active" label="Is Active" valuePropName="checked">
      <Switch />
    </Form.Item>
    <Form.Item
      name="sort"
      label={"Sort Order"}
    >
      <Input type={"number"} />
    </Form.Item>
  </Form>)
};

export default FaqCategoryForm;
