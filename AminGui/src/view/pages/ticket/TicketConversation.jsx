import {
    Avatar,
    Button,
    Form,
    Comment,
    Skeleton,
    Tooltip,
    List,
    Input,
    Space,
    Select,
    Row,
    Modal,
    Image,
    Typography, Divider, Descriptions
} from "antd";
import moment from "moment";
import React, {useEffect, useState, memo} from "react";
import {
    RiSendPlaneLine,
    RiFilePdfLine,
    RiMovieLine,
    RiFileUnknowLine
} from "react-icons/ri";
import MediaManager from "../../components/media-manager/MediaManager";
import SearchTemplateInput from "../../components/SearchTemplateInput";
import {useSelector} from "react-redux";
import {CASE_STATUS_DONE} from "../../../configs/appConfig";
import {formatDate} from "../../../utils/StringHelper";

const {TextArea} = Input;

const TicketConversation = ({loading}) => {

    const {ticket, ticketStatus} = useSelector(({ticket}) => ticket);
    const [form] = Form.useForm();
    const [selectImgList, setSelectImgList] = useState([]);
    const [data, setData] = useState(null);
    const [mediaLibVisible, setMediaLibVisible] = useState(false);

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
            <Form.Item>
                <Space size="small" wrap>
                    <Button type="link"
                            icon={<i className="ri-attachment-2-line"/>}
                            onClick={() => setMediaLibVisible(true)}
                    >
                        Add Attachment
                    </Button>
                    {selectImgList.map(item => {
                        return renderItem(item);
                    })}

                </Space>
            </Form.Item>
            <Row justify={"end"}>
                <Space size='small'>
                    <Button type="primary" icon={<RiSendPlaneLine className="remix-icon"/>}>
                        Send
                    </Button>
                </Space>
            </Row>
        </Form>)
    };

    const renderItem = (item) => {
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
                </div>
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

        return <div className="hp-d-flex hp-d-flex-column hp-align-items-center">
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

    const onReplyComment = () => {

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

    const fakeData = [
        {
            author: "Dolores O'Riordan",
            avatar: <Avatar src="https://picsum.photos/200/300"/>,
            content: (
                <p>
                    We supply a series of design principles, practical patterns and high
                    quality design resources (Sketch and Axure), to help people create
                    their product prototypes beautifully and efficiently.
                </p>
            ),
            datetime: (
                <Tooltip
                    title={moment().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss")}
                >
                    <span>{moment().subtract(1, "days").fromNow()}</span>
                </Tooltip>
            ),
        },
        {
            author: "Aeon Mall",
            avatar: <Avatar src="https://picsum.photos/200/300"/>,
            content: (
                <p>
                    We supply a series of design principles, practical patterns and high
                    quality design resources (Sketch and Axure), to help people create
                    their product prototypes beautifully and efficiently.
                </p>
            ),
            datetime: (
                <Tooltip
                    title={moment().subtract(2, "days").format("YYYY-MM-DD HH:mm:ss")}
                >
                    <span>{moment().subtract(2, "days").fromNow()}</span>
                </Tooltip>
            ),
        }
    ];


    return (
        <Skeleton loading={loading} active>
            <List
                size="small"
                className="comment-list"
                itemLayout="horizontal"
                dataSource={fakeData}
                renderItem={(item) => (
                    <li>
                        <Comment
                            actions={item.actions}
                            author={item.author}
                            avatar={item.avatar}
                            content={item.content}
                            datetime={item.datetime}
                        />
                    </li>
                )}
            />

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