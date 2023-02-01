import React, {useState} from "react";
import {Button, Card, Col, Form, Input, message, Row, Upload} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import CKEditor from "react-ckeditor-component";

const SettingWeb = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [contactContent, setContactContent] = useState("");

  const onCkBlur = (value) => {
    console.log(value);
  };

  const onCkChange = (value) => {
    console.log(value);
  };

  return (<Card size={"small"} title={"Web and Feedback Form"}>
    <Form layout={"vertical"} form={form}>
      <Row style={{flexDirection: "row"}}>
        <Col xs={{span: 24}} md={{span: 8}}>
          <Form.Item
            name="webPhone"
            label="Web phone"
            rules={[
              {
                required: true,
                message: 'Input your phone here',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={{span: 24}} md={{span: 8}}>
          <Form.Item
            name="webPhoneDisplay"
            label="Web phone display"
            rules={[
              {
                required: true,
                message: 'Input your phone text here',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={{span: 24}} md={{span: 8}}>
          <Form.Item
            name="webEmail"
            label="Web email"
            rules={[
              {
                required: true,
                message: 'Input your email here',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={{span: 24}} md={{span: 8}}>
          <Form.Item
            name="website"
            label="Website"
            rules={[
              {
                required: true,
                message: 'Input your website here',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={{span: 24}} md={8}>
          <Form.Item
            name="webBanner"
            label="Web banner"
            rules={[
              {
                required: true,
                message: 'Input your phone here',
              },
            ]}
          >
            {/*<Upload*/}
            {/*  listType="picture-card"*/}
            {/*  className="avatar-uploader"*/}
            {/*  showUploadList={false}*/}
            {/*  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"*/}
            {/*  beforeUpload={validateBeforeUpload}*/}
            {/*  onChange={handleUploadChange}*/}
            {/*>*/}
            {/*  {imageUrl ? (*/}
            {/*    <img*/}
            {/*      src={imageUrl}*/}
            {/*      alt="avatar"*/}
            {/*      style={{*/}
            {/*        width: '100%',*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  ) : (*/}
            {/*    uploadButton*/}
            {/*  )}*/}
            {/*</Upload>*/}
          </Form.Item>
        </Col>
        <Col xs={{span: 24}} md={8}>
          <Form.Item
            name="webLogo"
            label="Web Logo"
          >
            {/*<Upload*/}
            {/*  listType="picture-card"*/}
            {/*  className="avatar-uploader"*/}
            {/*  showUploadList={false}*/}
            {/*  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"*/}
            {/*  beforeUpload={validateBeforeUpload}*/}
            {/*  onChange={handleUploadChange}*/}
            {/*>*/}
            {/*  {imageUrl ? (*/}
            {/*    <img*/}
            {/*      src={imageUrl}*/}
            {/*      alt="avatar"*/}
            {/*      style={{*/}
            {/*        width: '100%',*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  ) : (*/}
            {/*    uploadButton*/}
            {/*  )}*/}
            {/*</Upload>*/}
          </Form.Item>
        </Col>
        <Col xs={{span: 24}} md={8}>
          <Form.Item
            name="companyName"
            label="Company Name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={{span: 24}} md={12}>
          <Form.Item
            name="feedbackFormDescription"
            label="Feed back form description"
          >
            <Input.TextArea rows={4} placeholder={"Max 191 character"} maxLength={6} />
          </Form.Item>
        </Col>
        <Col xs={{span: 24}}>
          <Form.Item
            name="contactContent"
            label="Contact Content"
          >
            <CKEditor
              activeClass="p10"
              content={contactContent}
              events={{
                'blur': onCkBlur,
                'change': onCkChange
              }}
            />
            <Input placeholder={"Enter contact content"} hidden />
          </Form.Item>
        </Col>
        <Col xs={{span: 24}}>
          <Form.Item>
            <Button type="primary">Save</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Card>)
};

export default SettingWeb;
