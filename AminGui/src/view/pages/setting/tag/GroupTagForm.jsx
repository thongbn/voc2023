import React, {useEffect} from "react";
import {Form, Input, Select, Switch, Tag} from "antd";
import {useSelector} from "react-redux";

const GroupTagForm = (props) => {
  const {form} = props;
  const {tagColors} = useSelector(({common}) => common);
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
      name="type"
      label="Type"
      rules={[
        {
          required: true,
          message: 'Please input your Type name',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item name="status" label="Is Active" valuePropName="checked">
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
    <Form.Item
      name="sortOrder"
      label={"Sort Order"}
    >
      <Input type={"number"} />
    </Form.Item>
  </Form>)
};

export default GroupTagForm;
