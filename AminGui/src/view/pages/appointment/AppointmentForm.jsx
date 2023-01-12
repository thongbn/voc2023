import {Avatar, Col, Divider, Form, Input, InputNumber, List, message, Row, Select, Typography} from "antd";
import React, {useEffect, useState} from "react";
import SearchSaleInput from "../../components/SearchSaleInput";
import SearchProductInput from "../../components/SearchProductInput";
import numeral from "numeral";
import {formatNumber} from "../../../utils/StringHelper";

const AppointmentForm = ({form, onSubmit, appointment}) => {
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isInputDisabled, setInputDisabled] = useState(false);

    useEffect(() => {
        console.log(appointment);
        if (appointment) {
            setSelectedAppointment(appointment);
        } else {
            setSelectedAppointment(null);
        }
    }, [appointment]);

    const onChangeSale = (value, saleName) => {
        console.log(value,saleName);
        form.setFieldValue('saleId', value);
        form.setFieldValue('saleName', saleName);
    };

    const onChangeProduct = (value, obj) => {
        form.setFieldValue("product", obj);
        setSelectedAppointment(prev => ({
            ...prev,
            product: obj
        }));
    };

    return <Form form={form}
                 disabled={isInputDisabled}
                 layout="vertical"
                 className=""
                 autoComplete={"off"}
                 onFinish={onSubmit}
                 size={"small"}
                 id={"appointmentForm"}
    >
        <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
                <Form.Item name="id" hidden/>
                <Form.Item name="product" hidden/>
                <Form.Item name="saleName" hidden/>
                <Form.Item name="name" label="Họ và tên :"
                           rules={[
                               {required: true, message: "Xin vui lòng nhập đầy đủ Họ và tên"}
                           ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại :"
                           rules={[
                               {required: true, message: "Xin vui lòng nhập số điện thoại"}
                           ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item name="email" label="Email (Nếu có) :">
                    <Input/>
                </Form.Item>
                <Form.Item name="saleId"
                           label="Chọn sale :"
                           help={selectedAppointment && selectedAppointment.saleId &&
                           <Typography.Text>
                               Sale đang chọn: {selectedAppointment.saleId} - {selectedAppointment.saleName}
                           </Typography.Text>}
                >
                    <SearchSaleInput onChange={onChangeSale}/>
                </Form.Item>
                <Form.Item name="note" label="Ghi chú :">
                    <Input.TextArea rows={3}/>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item name="customerFinance" label="Tài chính của khách hàng:"
                           initialValue={0}
                           rules={[
                               {type: "number", min: 0, message: "Tài chính của khách phải >= 0"},
                           ]}
                >
                    <InputNumber addonAfter={"VND"} style={{width: '100%'}} min={0}/>
                </Form.Item>
                <Form.Item name="selfCommission" label="Chiết khấu dành cho khách :"
                           initialValue={0}
                           rules={[
                               {type: "number", min: 0, max: 100, message: "Chiết khấu cho khách phải tử 0-100"},
                           ]}

                >
                    <InputNumber addonAfter={"%"} style={{width: '100%'}} min={0} max={100}/>
                </Form.Item>
                <Divider/>
                <Form.Item>
                    <SearchProductInput onChange={onChangeProduct}/>
                    <List>
                        {selectedAppointment && selectedAppointment.product && <List.Item
                            key={`li${selectedAppointment.product.id}`}
                            extra={
                                <img
                                    width={70}
                                    alt="logo"
                                    src={selectedAppointment.product.thumb}
                                />
                            }
                        >
                            <List.Item.Meta
                                title={selectedAppointment.product.name}
                                description={<>
                                    <strong>Chiết
                                        khấu: </strong> {formatNumber(selectedAppointment.product.commission)}%
                                    <br/>
                                    <strong>Giá:</strong> {formatNumber(selectedAppointment.product.price)}
                                </>}
                            />
                        </List.Item>}
                    </List>
                </Form.Item>
            </Col>
        </Row>

    </Form>;
};

export default AppointmentForm;