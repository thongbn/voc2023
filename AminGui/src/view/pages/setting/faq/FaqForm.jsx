import React, {useEffect, useState} from "react";
import {Form, Input, Select} from "antd";
import {useSelector} from "react-redux";
import CKEditor from "react-ckeditor-component";

const FaqForm = (props) => {
  const {form} = props;
  const {faqButtons} = useSelector(({faq}) => faq);
  const [ckContent, setCkContent] = useState({
    vi: "",
    en: ""
  });

  useEffect(() => {
    setCkContent({
      vi: form.getFieldValue("content"),
      en: form.getFieldValue("content_en")
    });
  }, [form]);

  useEffect(() => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      content: ckContent.vi,
      content_en: ckContent.en
    })
  }, [ckContent]);

  const formItemLayout = {
    // labelCol: {
    //   xs: {span: 24},
    //   sm: {span: 24},
    // },
    // wrapperCol: {
    //   xs: {span: 24},
    //   sm: {span: 24},
    // },
  };

  console.log(form);

  const onCkBlur = (value) => {
    console.log(value);
  };

  const onCkChange = (value) => {
    console.log(value);
  };

  return (<Form layout={"vertical"} {...formItemLayout} form={form}>
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
          message: 'Please input title in english',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item name="buttons"
               label={"Buttons"}
    >
      <Select
        showSearch
        mode="tags"
        tokenSeparators={[',']}
        labelInValue
      >
        {faqButtons.map((item, idx) => {
          return (
            <Select.Option key={`fbtn_${idx}`} value={item.id}>{item.title}</Select.Option>
          )
        })}
      </Select>
    </Form.Item>
    <Form.Item
      name="content"
      label="Content"
      rules={[
        {
          required: true,
          message: 'Please input content',
        },
      ]}
    >
      <CKEditor
        activeClass="p10"
        content={ckContent.vi}
        events={{
          'blur': onCkBlur,
          'change': onCkChange
        }}
      />
      <Input placeholder={"Enter content"} hidden />
    </Form.Item>
    <Form.Item
      name="content_en"
      label="Content Eng"
      rules={[
        {
          required: true,
          message: 'Please input content in english',
        },
      ]}
    >
      <CKEditor
        activeClass="p10"
        content={ckContent.en}
        events={{
          'blur': onCkBlur,
          'change': onCkChange
        }}
      />
      <Input placeholder={"Enter content"} hidden />
    </Form.Item>
  </Form>)
};

export default FaqForm;
