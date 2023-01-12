import {Button, Col, Form, Input, Row, Select} from "antd";
import {Search} from "react-iconly";
import SearchSaleInput from "../../components/SearchSaleInput";
import React from "react";

const AppointmentFilter = ({form, onSubmit}) => {

    const onChangeSale = (value) => {
        form.setFieldsValue('saleId', value);
    };

    return <Form form={form} onFinish={onSubmit} layout={"vertical"} size={"small"}>
        <Row gutter={[8, 0]}>
            <Col xs={24} md={6}>
                <Form.Item
                    name="name"
                >
                    <Input placeholder="Tên khách"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item name="phone">
                    <Input placeholder="Số điện thoại"/>
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item name="status">
                    <Select placeholder={"Trạng thái"}>
                        <Select.Option value="jack">Đã lên đơn</Select.Option>
                        <Select.Option value="Yiminghe">Đã liên hệ</Select.Option>
                        <Select.Option value="lucy">Mới</Select.Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item name="saleId">
                    <SearchSaleInput onChange={onChangeSale}/>
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

export default AppointmentFilter;