import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";

import {Row, Col, Form, Input, Button, Checkbox, message} from "antd";

import LeftContent from "../leftContent";
import Footer from "../footer";
import ApiHelper, {errorCatch} from "../../../../utils/ApiHelper";
import {useDispatch} from "react-redux";
import {loginSuccess} from "../../../../redux/auth"

export default function Login() {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            const res = await ApiHelper().post("/auth/login", values);
            const {data} = res;
            message.success("Đăng nhập thành công");
            dispatch(loginSuccess(data));
        } catch (e) {
            errorCatch(e, form);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row gutter={[32, 0]} className="hp-authentication-page">
            <LeftContent/>

            <Col lg={12} span={24} className="hp-py-sm-0 hp-py-md-64">
                <Row className="hp-h-100" align="middle" justify="center">
                    <Col
                        xxl={11}
                        xl={15}
                        lg={20}
                        md={20}
                        sm={24}
                        className="hp-px-sm-8 hp-pt-24 hp-pb-48"
                    >
                        <h1 className="hp-mb-sm-0">Login</h1>
                        <p className="hp-mt-sm-0 hp-mt-8 hp-text-color-black-60">
                            Welcome back, please login to your account.
                        </p>

                        <Form
                            form={form}
                            layout="vertical"
                            name="basic"
                            initialValues={{remember: true}}
                            className="hp-mt-sm-16 hp-mt-32"
                            onFinish={onSubmit}
                        >
                            <Form.Item name={'username'} label="Tên đăng nhập :" className="hp-mb-16"
                                       rules={[
                                           {required: true, message: "Xin vui lòng nhập username"}
                                       ]}
                            >
                                <Input id="error"/>
                            </Form.Item>

                            <Form.Item name={'password'} label="Mật khẩu :" className="hp-mb-8"
                                       rules={[
                                           {required: true, message: "Xin vui lòng nhập mật khẩu"},
                                           {min: 8, message: "Mật khẩu ít nhất 8 ký tự"},
                                       ]}
                            >
                                <Input.Password id="warning2"/>
                            </Form.Item>

                            <Row align="middle" justify="space-between">
                                <Form.Item name={"remember"} className="hp-mb-0">
                                    <Checkbox name="remember" checked>Remember me</Checkbox>
                                </Form.Item>

                                <Link
                                    className="hp-button hp-text-color-black-80 hp-text-color-dark-40"
                                    to="/auth/forgot-password"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </Row>

                            <Form.Item className="hp-mt-16 hp-mb-8">
                                <Button loading={loading} block type="primary" htmlType="submit">
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>

                        <Col className="hp-form-info hp-text-center">
              <span className="hp-text-color-black-80 hp-text-color-dark-40 hp-caption hp-font-weight-400 hp-mr-4">
                Bạn chưa có tải khoản?
              </span>

                            <Link
                                className="hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-caption"
                                to="/auth/register"
                            >
                                Tạo tài khoản mới
                            </Link>
                        </Col>

                        <Footer/>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};