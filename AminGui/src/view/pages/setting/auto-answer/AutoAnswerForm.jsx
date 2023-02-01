import React, {useEffect} from "react";
import {Form, Input, InputNumber, Select, Switch} from "antd";

const AutoAnswerForm = (props) => {
  const {form} = props;

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

  console.log(form);

  return (<Form {...formItemLayout} form={form}>
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
      <Input.TextArea maxLength={2000} showCount rows={8} />
    </Form.Item>
    <Form.Item
      name="maxWords"
      label="MaxWord"
      rules={[
        {
          required: true,
          message: 'Please input max word',
        },
      ]}
    >
      <InputNumber />
    </Form.Item>
    <Form.Item name="active" label="Is Active" valuePropName="checked">
      <Switch />
    </Form.Item>
    <Form.Item name="keywords"
               label={"Keywords"}
    >
      <Select
        mode="tags"
        tokenSeparators={[',']}
        labelInValue
      >
        {form.getFieldValue("keywords") && form.getFieldValue("keywords").map((item, idx) => {
          return (
            <Select.Option key={`kw_${idx}`} value={item}>{item}</Select.Option>
          )
        })}
      </Select>
    </Form.Item>
    <Form.Item
      initialValue={50}
      name="sortOrder"
      label="Priority"
      rules={[
        {
          required: true,
          message: 'Please input priority order. Default: 50',
        },
      ]}
    >
      <InputNumber />
    </Form.Item>
  </Form>)
};

export default AutoAnswerForm;
