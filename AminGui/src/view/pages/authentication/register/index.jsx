import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";

import {Row, Col, Form, Input, Button, message, Select} from "antd";

import LeftContent from "../leftContent";
import Footer from "../footer";
import ApiHelper, {errorCatch} from "../../../../utils/ApiHelper";
import {parseUrlParams} from "../../../../utils/StringHelper";
import {useCookies} from "react-cookie";

export default function SignUp(props) {
    const {location} = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const history = useHistory();
    const [cookies, setCookie] = useCookies(['reference-id']);

    useEffect(() => {
        const query = parseUrlParams(location.search);
        let referenceId = null;
        if(query.reference){
            setCookie('reference-id', query.reference, {
                maxAge: 3600*24*30 //30 days
            });
            referenceId = query.reference;
        }else if(cookies && cookies['reference-id']){
            referenceId = cookies['reference-id'];
        }

        if(referenceId){
            form.setFieldValue('referenceId', referenceId);
        }

    }, [location.search]);

    const onSubmit = async (values) => {

        try {
            setLoading(true);
            const res = await ApiHelper().post("/auth/register", values);
            await message.success("Tạo tài khoản thành công! Xin vui lòng quay lại đăng nhập"
                , 3);
            history.push('/auth/login');
            console.log(res);
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
                        <span
                            className="hp-d-block hp-p1-body hp-text-color-dark-0 hp-text-color-black-100 hp-font-weight-500 hp-mb-6">SIGN UP FOR FREE</span>
                        <h1>Tạo tài khoản</h1>
                        <p className="hp-mt-8 hp-text-color-black-60">
                            Chào mừng bạn đã đến với chương trình Affiliate của Smileup.
                        </p>

                        <Form
                            name="registerForm"
                            form={form}
                            layout="vertical"
                            className="hp-mt-sm-16 hp-mt-32"
                            autoComplete={"off"}
                            onFinish={onSubmit}
                        >
                            <Form.Item name="fullName" label="Họ và tên :"
                                       rules={[
                                           {required: true, message: "Xin vui lòng nhập đầy đủ Họ và tên"}
                                       ]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item name="username" label="Tên đăng nhập :"
                                       rules={[
                                           {required: true, message: "Xin vui lòng nhập đầy đủ Username"}
                                       ]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item name={"email"} label="E-mail :"
                                       rules={[
                                {required: true, message: "Xin vui lòng nhập email"}
                            ]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item name={"phone"} label="Số điện thoại :"
                                       rules={[
                                           {required: true, message: "Xin vui lòng nhập số điện thoại"}
                                       ]}
                            >
                                <Input/>
                            </Form.Item>

                            <Form.Item name="password" label="Mật khẩu :"
                                       rules={[
                                           {required: true, message: "Xin vui lòng nhập mật khẩu"}
                                       ]}
                            >
                                <Input.Password/>
                            </Form.Item>

                            <Form.Item name={"confirmPassword"} label="Xác nhận mật khẩu :"
                                       dependencies={['password']}
                                       hasFeedback
                                       rules={[
                                           {required: true, message: "Xin vui lòng nhập lại mật khẩu"},
                                           ({getFieldValue}) => ({
                                               validator(_, value) {
                                                   if (!value || getFieldValue('password') === value) {
                                                       return Promise.resolve();
                                                   }
                                                   return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                               },
                                           }),
                                       ]}
                            >
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item name="role" label="Quyền :"
                                       rules={[
                                           {required: true, message: "Xin vui lòng nhập role"}
                                       ]}
                            >
                                <Select
                                    showSearch
                                    options={[
                                        {
                                            value: 'sadmin',
                                            label: 'Super Admin',
                                        },
                                        {
                                            value: 'admin',
                                            label: 'Admin',
                                        },
                                        {
                                            value: 'aeonSupport',
                                            label: 'Aeon Supporter',
                                        },
                                        {
                                            value: 'support',
                                            label: 'Supporter',
                                        },
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item className="hp-mt-16 hp-mb-8">
                                <Button loading={loading} block type="primary" htmlType="submit">
                                    Đăng ký
                                </Button>
                            </Form.Item>
                        </Form>

                        <div className="hp-form-info hp-text-center">
                              <span className="hp-text-color-black-80 hp-text-color-dark-40 hp-caption hp-mr-4">
                                Bạn đã có tài khoản?
                              </span>
                            <Link
                                to="/auth/login"
                                className="hp-text-color-primary-1 hp-text-color-dark-primary-2 hp-caption"
                            >
                                Đăng nhập ngay
                            </Link>
                        </div>

                        <Footer/>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};