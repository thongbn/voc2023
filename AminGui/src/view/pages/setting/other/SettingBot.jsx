import React from "react";
import {Button, Card, Form, Input, Typography} from 'antd';
import {RobotOutlined, SaveOutlined} from "@ant-design/icons";

const SettingBot = () => {

  const [form] = Form.useForm();

  const hintWelcomeText = () => {
    return (<>
      <div>Update to bot" will update welcome text to Facebook welcome sceen, please use this button 5 mins each update
        "Welcome text" have maximum 160 character. "Save" before update to bot. Can add some param to display user's
        name.
      </div>
      <ul>
        <li>{`{{user_first_name}}`}</li>
        <li>{`{{user_last_name}}`}</li>
        <li>{`{{user_full_name}}`}</li>
      </ul>
    </>)
  };

  const onConfirmSubmit = () => {

  };

  return (<Card size={"small"}
                title={"Bot"}
                actions={[
                  <Button style={{marginBottom: "0px"}} icon={<SaveOutlined />} key={"botSSave"}>Save</Button>,
                  <Button style={{marginBottom: "0px"}} icon={<RobotOutlined />} key={"botSPublish"}>Publish</Button>
                ]}
  >
    <Form layout={"vertical"}>
      <Form.Item
        name="welcomeText"
        label="Welcome Text"
        rules={[
          {
            required: true,
            message: 'Please input Tag Name',
          },
        ]}
      >
        <Input />
        <Typography.Text type={"secondary"}>
          {hintWelcomeText()}
        </Typography.Text>
      </Form.Item>
    </Form>
  </Card>)
};


export default SettingBot;
