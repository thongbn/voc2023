import {Avatar, Button, Form, Comment, Skeleton, Tooltip, List, Input, Space, Select, Row} from "antd";
import moment from "moment";
import React, {useEffect, useState, memo} from "react";
import {RiSendPlaneLine} from "react-icons/ri"

const {TextArea} = Input;

const TicketConversation = ({dataSource, isLoading}) => {

    const [form] = Form.useForm();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(isLoading);

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
                <Space size="small">
                    <Button type="link" icon={<i className="ri-attachment-2-line"/>}>Add Attachment</Button>
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


    const onReplyComment = () => {

    };


    const onSearchTemplate = () => {

    };

    const onSelectTemplate = () => {

    }

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

        </Skeleton>
    )
}

export default memo(TicketConversation);