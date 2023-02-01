import React, {useEffect, useState} from "react";
import {Form, Input, Select, Switch, Tag} from "antd";
import {useSelector} from "react-redux";

const TagForm = (props) => {
  const {form} = props;
  const {tagCategories} = useSelector(({tag}) => tag);
  const {tagColors} = useSelector(({common}) => common);

  const [keywords, setKeywords] = useState([]);

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
      name="name"
      label="Name"
      rules={[
        {
          required: true,
          message: 'Please input Tag Name',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item name="active" label="Is Active" valuePropName="checked">
      <Switch />
    </Form.Item>
    <Form.Item name="color"
               label={"Color"}
               rules={[
                 {
                   required: true,
                   message: 'Please input tag color',
                 },
               ]}
    >
      <Select
        labelInValue
      >
        {tagColors.map((item, idx) => {
          return <Select.Option key={`tc_${idx}`} value={item}><Tag color={item}>{item}</Tag></Select.Option>
        })}
      </Select>
    </Form.Item>
    <Form.Item name="groupTagId"
               label={"Group tag"}
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
        {groupTags.map(item => {
          return (
            <Select.Option key={`egt_${item.id}`} value={item.id}><Tag
              color={item.color}>{item.type}</Tag></Select.Option>
          )
        })}
      </Select>
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
  </Form>)
};

export default TagForm;
