import React, {memo} from "react";
import {MESSAGE_TYPE_TEXT_ATTACHMENT} from "../../../../configs/appConfig";
import {Avatar, Comment, Tooltip, Typography} from "antd";
import moment from "moment";

const TicketComment = ({data}) => {

    const renderType = () => {
        switch (data.type) {
            case MESSAGE_TYPE_TEXT_ATTACHMENT:
                return data.data;
                break;
            default:
                return <Typography italic>Unsupported yet {data.data}</Typography>
        }
    };

    return <Comment
        // actions={item.actions}
        author={data.customerId}
        avatar={<Avatar src="https://picsum.photos/200/300"/>}
        content={renderType()}
        datetime={<Tooltip
            title={`Updated at: ${moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss")}`}
        >
            <span>{moment(data.createdAt).fromNow()}</span>
        </Tooltip>}
    />;
};

export default memo(TicketComment);