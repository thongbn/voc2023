import {CASE_STATUS, CASE_TYPE_MESSAGE, CASE_TYPES, PLATFORMS} from "../configs/appConfig";
import {RiFileUnknowFill} from "react-icons/ri";
import React from "react";
import {Tag, Typography} from 'antd';
import moment from "moment";

export const renderPlatformIcon = (platform) => {
    try {
        return PLATFORMS[platform].icon;
    } catch (e) {
        return <RiFileUnknowFill className="remix-icon"/>
    }
};

export const renderType = (type) => {
    try {
        return CASE_TYPES[type].name;
    } catch (e) {
        return <RiFileUnknowFill className="remix-icon"/>
    }
};

export const renderCaseStatusTag = (caseStatus, type = "tag") => {
    let name = "Unknown";
    let color = "danger";
    if (CASE_STATUS[caseStatus]) {
        name = CASE_STATUS[caseStatus].name;
        color = CASE_STATUS[caseStatus].color;
    }

    switch (type) {
        case "tag":
            return <Tag color={color} className={`bg-${color}`} size="small">{name}</Tag>;
        default:
            return <Typography.Text type={color} className={`t-${color}`}>{name}</Typography.Text>
    }
};

export const renderTicketTag = (tag, className = "") => {
    if (!tag) {
        return "";
    }

    return <Tag color={tag.color}
                className={`bg-${tag.color} ${className}`}>
        {tag.tag_name}
    </Tag>
};

export const renderInboxTimeWarning = (ticket, className = "") => {

    if (!ticket || ticket.type !== CASE_TYPE_MESSAGE) {
        return <></>;
    }

    if (!ticket.lcmTime) {
        return <></>;
    }

    try {
        const lcmTime = moment(ticket.lcmTime);
        if(ticket.lrmTime){
            let lrmTime = moment(ticket.lrmTime);
            const hours = moment.duration(lcmTime.diff(lrmTime)).asHours();
            if(hours < 0){
                return <Typography.Text type='secondary' italic style={{fontSize: "10px", fontWeight: "normal"}}>
                    Wait customer feedback
                </Typography.Text>;
            }
        }

        const nowTime = moment();
        const hours = moment.duration(lcmTime.diff(nowTime)).asHours();
        let title = "24h+";
        let color = "error";
        if (hours < 12) {
            title = "< 12h";
            color = "success";
        } else if (hours < 24) {
            title = "12h+";
            color = "yellow";
        }

        return <Tag color={color} className={`${className}`}>
            {title}
        </Tag>
    } catch (e) {
        console.error(e);
        return <></>;
    }
};