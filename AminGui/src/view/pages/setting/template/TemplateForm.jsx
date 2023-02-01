import React, {useEffect, useState} from "react";
import {Form, Input, Select, Switch, Tag, InputNumber} from "antd";
import {useSelector} from "react-redux";

const TemplateForm = (props) => {
  const {form} = props;
  const templateCategories = useState([]);
  useEffect(() => {

  }, [form]);

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
          message: 'Please input Title Name',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="content"
      label="Content"
      rules={[
        {
          required: true,
          message: 'Please input Content',
        },
      ]}
    >
      <Input.TextArea showCount rows={8} maxLenght={2000}/>
    </Form.Item>
    <Form.Item name="categoryId"
               label={"Category"}
               rules={[
                 {
                   required: true,
                   message: 'Please input group tag',
                 },
               ]}
    >
      <Select
        labelInValue
      >
        {templateCategories.map(item => {
          return (
            <Select.Option key={`egt_${item.id}`} value={item.id}>
              {item.name}
            </Select.Option>
          )
        })}
      </Select>
    </Form.Item>
    <Form.Item name="status" label="Status" valuePropName="checked">
      <Switch />
    </Form.Item>
    <Form.Item name="sortOrder"
               label={"Sort Order"}
    >
      <InputNumber/>
    </Form.Item>
  </Form>)
};

export default TemplateForm;
