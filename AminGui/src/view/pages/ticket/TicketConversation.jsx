import { Avatar, Image, Comment, Skeleton, Tooltip, List } from "antd";
import moment from "moment";
import React, { useEffect, useState, memo } from "react";

const TicketConversation = ({ dataSource, isLoading }) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(isLoading);

    useEffect(() => {
        setData(dataSource);
    }, [dataSource]);

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading]);

    const fakeData = [
        {
            author: "Dolores O'Riordan",
            avatar: <Avatar src="https://picsum.photos/200/300" />,
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
            author: "Dolores O'Riordan",
            avatar: <Avatar src="https://picsum.photos/200/300" />,
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