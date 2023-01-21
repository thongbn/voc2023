import React, {memo, useEffect, useState} from "react";
import ApiHelper, {errorCatch} from "../../../utils/ApiHelper";
import {Button, Col, Form, Input, Row, Typography} from "antd";
import {RiStickyNoteLine, RiSave2Line} from "react-icons/ri";
import {useDispatch, useSelector} from "react-redux";
import {updateNotes} from "../../../redux/ticket";

const {Paragraph, Text, Title} = Typography;

const TicketNote = () => {

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const {ticket, ticketNotes} = useSelector(({ticket}) => ticket);
    const [loading, setLoading] = useState(false);

    const submitNote = async (values) => {
        try {
            setLoading(true);
            const res = await ApiHelper().post(`/tickets/${ticket.id}/note`, values);
            dispatch(updateNotes(res.data.data));
            form.resetFields();
        } catch (e) {
            errorCatch(e);
        } finally {
            setLoading(false);
        }
    };

    return <>
        <Title level={5}>Note</Title>
        <Paragraph>
            <ul>
                {ticketNotes.map((item, idx) => {
                    return <li key={`n_${idx}`}>
                        <strong>{item.user}</strong>: {item.message}
                    </li>
                })}
            </ul>
        </Paragraph>
        <Form form={form} size="small" onFinish={submitNote}>
            <Row gutter={8}>
                <Col xs={18}>
                    <Form.Item name={"message"}
                               rules={[{required: true, message: 'Please enter note!'}]}
                    >
                        <Input placeholder={"Enter note"}/>
                    </Form.Item>
                </Col>
                <Col xs={6}>
                    <Form.Item>
                        <Button
                            loading={loading}
                            size='small'
                            htmlType="submit"
                            icon={<RiSave2Line className="remix-icon"/>}>
                            Add
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </>
};

export default memo(TicketNote);