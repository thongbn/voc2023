import React, {memo} from "react";
import {MESSAGE_TYPE_POSTBACK, MESSAGE_TYPE_RATINGS, MESSAGE_TYPE_TEXT_ATTACHMENT} from "../../../../configs/appConfig";
import {Avatar, Comment, Space, Tooltip, Typography, Image, Tag} from "antd";
import moment from "moment";
import {nl2br} from "../../../../utils/AppRenderHelper";

const TicketComment = ({data}) => {

    const renderRecommendationTag = (type) => {
        let color = "red";
        if (type === "POSITIVE") {
            color = "green";
        }

        return <Tag color={color}>{type}</Tag>
    };

    const renderRating = (mess) => {
        if (!mess.data) {
            return <Typography.Text italic>Data is null</Typography.Text>
        }
        const objData = JSON.parse(mess.data);
        const otherData = JSON.parse(mess.other);
        return <Space direction="vertical" style={{width: "100%"}}>
            {objData?.recommendationType && renderRecommendationTag(objData.recommendationType)}
            {objData?.text && objData?.text}
            {objData?.attachments && objData?.attachments.map((item, idx) => renderAttachments(item, idx))}
            {otherData?.error && renderError(otherData.error)}
        </Space>
    };

    const renderError = (error) => {
        return <Typography.Text italic mark style={{fontSize: "0.7rem"}}>
            {JSON.stringify(error)}
        </Typography.Text>
    };

    const renderAttachments = (item, idx) => {
        switch (item.type) {
            case 'image':
                return <Image key={`att_${idx}`} src={item?.payload?.url} width={100}/>;
            case 'template': {
                const {payload} = item;
                if (!payload) {
                    return "";
                }
                const {buttons} = payload;
                return <Space key={`att_${idx}`}>
                    {buttons ? buttons.map((item, idxx) => {
                        return <Tag key={`att_${idx}${idxx}`}>{item.title}</Tag>
                    }) : ""}
                </Space>
            }
            default:
                return <a key={`att_${idx}`} href={item?.payload?.url} target="_blank">
                    Click to open or download content {item?.payload?.type}
                </a>
        }
    };

    const renderTextAndAttachment = (mess) => {
        if (!mess.data) {
            return <Typography.Text italic>Data is null</Typography.Text>
        }
        const objData = JSON.parse(mess.data);
        const otherData = JSON.parse(mess.other);

        return <Space direction="vertical" style={{width: "100%"}}>
            {objData?.text && <div dangerouslySetInnerHTML={{
                __html: nl2br(objData.text)
            }}/>}
            {objData?.title}
            {objData?.attachments && objData.attachments.map((item, idx) => renderAttachments(item, idx))}
            {otherData?.error && renderError(otherData.error)}
        </Space>
    };


    const renderType = () => {
        let ret;
        switch (data.type) {
            case MESSAGE_TYPE_POSTBACK:
            case MESSAGE_TYPE_TEXT_ATTACHMENT:
                ret = renderTextAndAttachment(data);
                break;
            case MESSAGE_TYPE_RATINGS:
                ret = renderRating(data);
                break;
            default:
                ret = <Typography.Text italic>Unsupported yet {data.data}</Typography.Text>
        }
        return ret;
    };

    return <Comment
        // actions={item.actions}
        author={data.customer?.fullname}
        avatar={<Avatar src={`${data.customer?.avatar || "https://picsum.photos/200/300"}`}/>}
        content={renderType()}
        datetime={<Tooltip
            title={`Updated at: ${moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss")}`}
        >
            <span>{moment(data.createdAt).fromNow()}</span>
        </Tooltip>}
    />;
};

export default memo(TicketComment);