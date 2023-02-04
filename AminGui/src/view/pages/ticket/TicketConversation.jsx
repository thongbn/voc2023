import {
    Button,
    Form,
    Skeleton,
    Input,
    Space,
    Row,
    Modal,
    Image,
    Typography, Divider, Descriptions, message
} from "antd";
import React, {useEffect, useState, memo} from "react";
import {
    RiSendPlaneLine,
    RiFilePdfLine,
    RiMovieLine,
    RiFileUnknowLine
} from "react-icons/ri";
import MediaManager from "../../components/media-manager/MediaManager";
import SearchTemplateInput from "../../components/SearchTemplateInput";
import {useDispatch, useSelector} from "react-redux";
import {CASE_STATUS_DONE, CASE_TYPE_COMMENT, PLATFORM_IG} from "../../../configs/appConfig";
import {formatDate} from "../../../utils/StringHelper";
import TicketCommentList from "./comment/TicketCommentList";
import ApiHelper from "../../../utils/ApiHelper";
import {updateStatus} from '../../../redux/ticket';

const {TextArea} = Input;

const TicketConversation = ({loading}) => {

    const {ticket, ticketStatus} = useSelector(({ticket}) => ticket);
    const [form] = Form.useForm();
    const [selectImgList, setSelectImgList] = useState([]);
    const [mediaLibVisible, setMediaLibVisible] = useState(false);
    const [replyLoading, setReplyLoading] = useState(false);
    const dispatch = useDispatch();

    const CommentForm = () => {
        return (<Form
            form={form}
            layout="vertical"
            name="basic"
            size={"small"}
            onFinish={onReplyComment}
        >
            <Form.Item>
                <SearchTemplateInput onChange={onSelectTemplate}/>
            </Form.Item>
            <Form.Item name="message">
                <TextArea rows={5} placeholder={"Nhập phản hồi"}/>
            </Form.Item>
            {(ticket?.platform !== PLATFORM_IG || ticket?.type !== CASE_TYPE_COMMENT) && <Form.Item>
                <Space size="small" wrap>
                    <Button type="link"
                            icon={<i className="ri-attachment-2-line"/>}
                            onClick={() => setMediaLibVisible(true)}
                    >
                        Add Attachment
                    </Button>
                    {selectImgList.map((item, idx) => {
                        return renderItem(item, idx);
                    })}

                </Space>
            </Form.Item>}
            <Row justify={"end"}>
                <Space size='small'>
                    <Button type="primary"
                            loading={replyLoading}
                            htmlType={"submit"} icon={<RiSendPlaneLine className="remix-icon"/>}>
                        Send
                    </Button>
                </Space>
            </Row>
        </Form>)
    };

    const renderItem = (item, idx) => {
        let previewItem = null;
        switch (item.mime) {
            case "image/png":
            case "image/jpeg": {
                previewItem = <Image width={50}
                                     height={50}
                                     src={process.env.REACT_APP_RESOURCE_URL + item.path}/>;
                break;
            }
            case "application/pdf": {
                previewItem = <div className="hp-d-flex hp-d-flex-column hp-align-items-center"
                                   style={{height: "50px", width: "50px"}}
                >
                    <RiFilePdfLine size={50}/>
                    <Typography.Text ellipsis style={{fontSize: '10px'}}>
                        {item.name}
                    </Typography.Text>
                </div>;
                break;
            }
            case "video/mp4":
            case "audio/mp4":
            case "application/mp4":
            case "application/x-mpegURL":
            case "video/quicktime": {
                previewItem = <div className="hp-d-flex hp-d-flex-column hp-align-items-center"
                                   style={{height: "50px", width: '50px'}}
                >
                    <RiMovieLine size={50}/>
                    <Typography.Text ellipsis style={{fontSize: '10px'}}>
                        {item.name}
                    </Typography.Text>
                </div>;
                break;
            }
            default:
                previewItem = <div className="hp-d-flex hp-d-flex-column hp-align-items-center"
                                   style={{height: "50px", width: "50px"}}
                >
                    <RiFileUnknowLine size={50}/>
                    <Typography.Text ellipsis style={{fontSize: '10px'}}>
                        {item.name}
                    </Typography.Text>
                </div>;
        }

        return <div className="hp-d-flex hp-d-flex-column hp-align-items-center" key={`ui_${item.id}${idx}`}>
            {previewItem}
            <Button size="small"
                    danger
                    type="link"
                    onClick={() => onRemoveImage(item.id)}
                    style={{marginTop: "4px", fontSize: "10px"}}>
                Remove
            </Button>
        </div>
    };

    const onReplyComment = async (values) => {
        console.log(values, selectImgList);
        try {
            setReplyLoading(true);
            const res = await ApiHelper().post(`/tickets/${ticket?.id}/reply`, {
                message: values.message,
                attachments: selectImgList.map(item => {
                    return {
                        path: item.path,
                        mime: item.mime,
                        name: item.name
                    }
                })
            });
            console.log(res.data);
            if (res.data?.ticket?.caseStatus) {
                dispatch(updateStatus(res.data.ticket.caseStatus));
            }
            if (res.data?.replyModel?.errors) {
                res.data?.replyModel?.errors.map(item => {
                    message.error(item.error?.message || item.message || item);
                });
            }
            form.resetFields();
        } catch (e) {
            console.error(e);
            message.error(e.message);
        } finally {
            setReplyLoading(false);
        }
    };

    const onSelectTemplate = (val, obj) => {
        form.setFieldValue("message", obj.content);
    };

    const onSelectImage = (item) => {
        setSelectImgList([
            ...selectImgList,
            item
        ]);
        setMediaLibVisible(false);
    };

    const onRemoveImage = (id) => {
        setSelectImgList(selectImgList.filter(item => item.id !== id));
    };

    return (
        <Skeleton loading={loading} active>
            {ticket && <TicketCommentList id={ticket.id}/>}
            {ticketStatus !== CASE_STATUS_DONE ? <CommentForm/> : (
                <>
                    <Divider/>
                    <Typography.Title level={5}>
                        VOC
                    </Typography.Title>
                    <Descriptions size="small" bordered column={1}>
                        <Descriptions.Item label="Voc">{ticket?.vocMessage}</Descriptions.Item>
                        <Descriptions.Item label="Voc (Eng)">{ticket?.vocMessageEn}</Descriptions.Item>
                        <Descriptions.Item label="Solution">{ticket?.vocNote}</Descriptions.Item>
                        <Descriptions.Item label="Solution (Eng)">{ticket?.vocNoteEn}</Descriptions.Item>
                        <Descriptions.Item label="Close date">{formatDate(ticket?.closedDate)}</Descriptions.Item>
                    </Descriptions>
                </>
            )}
            <Modal title="Media Library"
                   open={mediaLibVisible}
                   style={{
                       maxWidth: "100%",
                   }}
                   width={1000}
                   footer={[]}
                   onCancel={() => setMediaLibVisible(false)}
            >
                <MediaManager showSelect onSelectImage={onSelectImage}/>
            </Modal>
        </Skeleton>
    )
};

export default memo(TicketConversation);