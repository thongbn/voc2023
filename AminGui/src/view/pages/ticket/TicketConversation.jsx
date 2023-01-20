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
    Typography
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

const {TextArea} = Input;

const TicketConversation = ({dataSource, isLoading}) => {

    const [form] = Form.useForm();
    const [selectImgList, setSelectImgList] = useState([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(isLoading);
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
                <Select placeholder={"Nhập id, từ khóa của template"}
                        showSearch
                        onSearch={onSearchTemplate}
                        onSelect={onSelectTemplate}/>
            </Form.Item>
            <Form.Item name="message">
                <TextArea rows={3} placeholder={"Nhập phản hồi"}/>
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

    useEffect(() => {
        setData(dataSource);
    }, [dataSource]);

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);


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


    const onSearchTemplate = () => {

    };

    const onSelectTemplate = () => {

    };

    const onSelectImage = (item) => {
        console.log(item);
        setSelectImgList([
            ...selectImgList,
            item
        ]);
        console.log(selectImgList);
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
        },
        {
            author: "Aeon Mall",
            avatar: <Avatar src="https://picsum.photos/200/300"/>,
            content: <CommentForm/>,
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