import React, {memo, useEffect, useState} from "react";
import ApiHelper, {errorCatch} from "../../../utils/ApiHelper";
import {Button, Col, Form, Input, message, Modal, Row, Segmented, Typography} from "antd";
import {RiStickyNoteLine, RiSave2Line} from "react-icons/ri";
import {useDispatch, useSelector} from "react-redux";
import {updateStatus} from "../../../redux/ticket";
import {renderCaseStatusTag} from "../../../utils/AppRenderHelper";
import {CASE_STATUS_DONE, CASE_STATUS_NEW, CASE_STATUS_PROCESSING} from "../../../configs/appConfig";
import IntlMessages from "../../../layout/components/lang/IntlMessages";

const {Paragraph, Text, Title} = Typography;

const TicketCaseStatus = () => {

    const dispatch = useDispatch();
    const {ticket, ticketStatus} = useSelector(({ticket}) => ticket);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [vocFormModal, setVocFormModal] = useState(false);

    const onChangeSegment = async (value) => {
        switch (value) {
            case CASE_STATUS_PROCESSING:
                await onSetProcessing();
                break;
            case CASE_STATUS_DONE:
                setVocFormModal(true);
                break;
            default:
                console.error(`${value} not supported`);
        }
    };

    const onSetDone = async (values) => {
        try{
            setLoading(true);
            await ApiHelper().post(`/tickets/${ticket?.id}/set-done`, {
                ...values
            });
            dispatch(updateStatus(CASE_STATUS_DONE));
            setVocFormModal(false);
            message.success("Case changed to Done");
        }catch (e) {
            errorCatch(e);
        }finally {
            setLoading(false);
        }
    };

    const onSetProcessing = async () => {
        try{
            setLoading(true);
            await ApiHelper().post(`/tickets/${ticket?.id}/set-processing`);
            dispatch(updateStatus(CASE_STATUS_PROCESSING));
            message.success("Case changed to Processing");
        }catch (e) {
            errorCatch(e);
        }finally {
            setLoading(false);
        }
    };

    return <>
        <Segmented
            size="small"
            block
            disabled={loading}
            value={ticketStatus}
            onChange={onChangeSegment}
            options={[
                {
                    label: renderCaseStatusTag(CASE_STATUS_NEW, "text"),
                    value: CASE_STATUS_NEW,
                    disabled: true,
                },
                {
                    label: renderCaseStatusTag(CASE_STATUS_PROCESSING, "text"),
                    value: CASE_STATUS_PROCESSING,
                },
                {
                    label: renderCaseStatusTag(CASE_STATUS_DONE, "text"),
                    value: CASE_STATUS_DONE,
                }
            ]}/>
        <Modal open={vocFormModal}
               onCancel={() => setVocFormModal(false)}
               title={`Case #${ticket?.id} set Done`}
               footer={[
                   <Button form="vocForm" key="submit" type={"primary"} htmlType="submit">
                       Set Case Finished
                   </Button>
               ]}
        >
            <Form id='vocForm'
                  onFinish={onSetDone}
                  form={form}
                  layout={"vertical"}
                  initialValues={{
                      voc: ticket?.vocMessage || ticket?.firstMessage,
                      vocEn: ticket?.vocMessageEn,
                      note: ticket?.vocNote,
                      noteEn: ticket?.vocNoteEn
                  }}
            >
                <Row gutter={[8, 8]}>
                    <Col xs={24} md={12}>
                        <Form.Item name={"voc"} label={"Voc"}
                                   rules={[{required: true, message: 'Please enter voc!'}]}
                        >
                            <Input.TextArea placeholder={"Enter voc"} rows={3}/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name={"vocEn"} label={"Voc in English"}
                        >
                            <Input.TextArea placeholder={"Enter Voc in English"} rows={3}/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name={"note"} label={"Solution"}
                        >
                            <Input.TextArea placeholder={"Enter Solution"} rows={3}/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name={"noteEn"} label={"Solution in English"}
                        >
                            <Input.TextArea placeholder={"Enter Solution in English"} rows={3}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    </>
};

export default memo(TicketCaseStatus);