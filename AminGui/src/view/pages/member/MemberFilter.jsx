import {Button, Col, Form, Input, Row, Select} from "antd";
import {Search} from "react-iconly";
import SearchSaleInput from "../../components/SearchSaleInput";
import React from "react";
import {TRANS_LOG_TYPE, TRANS_PAID_STATUS} from "../../../configs/appConfig";

const MemberFilter = ({form, onSubmit}) => {

    return <Form form={form} onFinish={onSubmit} layout={"vertical"} size={"small"}>
        <Row gutter={[8, 0]}>
            <Col xs={24} md={4}>
                <Form.Item
                    name="id"
                >
                    <Input placeholder="Mã tài khoản"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={4}>
                <Form.Item name="email">
                    <Input placeholder="Email"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={4}>
                <Form.Item name="phone">
                    <Input placeholder="Điện thoại"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item>
                    <Button htmlType={"submit"} type={"primary"} icon={<Search/>}>Tìm kiếm</Button>
                </Form.Item>
            </Col>
        </Row>
    </Form>;
};

export default MemberFilter;