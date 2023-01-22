import {Descriptions} from "antd";
import moment from "moment";
import React, {memo, useState} from "react";
import {useSelector} from "react-redux";
import {renderPlatformIcon, renderType} from "../../../utils/AppRenderHelper";

const TicketOtherInfo = () => {
    const {ticket} = useSelector(({ticket}) => ticket);
    return (
        <Descriptions size="small" bordered column={1}>
            <Descriptions.Item label="Type">
                {renderType(ticket?.type)}
            </Descriptions.Item>
            <Descriptions.Item label="Platform">
                {renderPlatformIcon(ticket?.platform)}
            </Descriptions.Item>
            <Descriptions.Item
                label="Last Customer reply">{ticket?.lcmTime && moment(ticket?.lcmTime).format("DD/MM/YYYY H:m")}</Descriptions.Item>
            <Descriptions.Item
                label="Last Admin reply">{ticket?.lrmTime && moment(ticket?.lrmTime).format("DD/MM/YYYY H:m")}</Descriptions.Item>
            <Descriptions.Item label="Created">{moment(ticket.createdAt).format("DD/MM/YYYY H:m")}</Descriptions.Item>
            <Descriptions.Item label="Updated">{moment(ticket.updatedAt).format("DD/MM/YYYY H:m")}</Descriptions.Item>
        </Descriptions>
    )
};

export default TicketOtherInfo;