import {Button, Col, Form, Input, Row, Select} from "antd";
import {Search} from "react-iconly";
import SearchSaleInput from "../../components/SearchSaleInput";
import React from "react";
import {TRANS_LOG_TYPE, TRANS_PAID_STATUS} from "../../../configs/appConfig";

const TransactionFilter = ({form, onSubmit}) => {

    return <Form form={form} onFinish={onSubmit} layout={"vertical"} size={"small"}>
        <Row gutter={[8, 0]}>
            <Col xs={24} md={4}>
                <Form.Item
                    name="id"
                >
                    <Input placeholder="Mã giao dịch"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={4}>
                <Form.Item name="orderId">
                    <Input placeholder="Mã đơn hàng"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={4}>
                <Form.Item name="appointmentId">
                    <Input placeholder="Mã lịch hẹn"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item name="type">
                    <Select placeholder={"Loại"} allowClear>
                        {Object.keys(TRANS_LOG_TYPE).map((key) => {
                            return <Select.Option key={`tlt_${key}`}
                                                  value={key}>
                                {TRANS_LOG_TYPE[key].name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item name="paidStatus">
                    <Select placeholder={"Xử lý"} allowClear>
                        {Object.keys(TRANS_PAID_STATUS).map((key) => {
                            return <Select.Option key={`tlt_${key}`}
                                                  value={key}>
                                {TRANS_PAID_STATUS[key].name}
                            </Select.Option>
                        })}
                    </Select>
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

export default TransactionFilter;