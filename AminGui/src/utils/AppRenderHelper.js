import {CASE_STATUS, CASE_TYPES, PLATFORMS} from "../configs/appConfig";
import {RiFileUnknowFill} from "react-icons/ri";
import React from "react";
import {Tag, Typography} from 'antd';

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

const renderInboxTimeWarning = (ticket) => {
    if(!ticket.lcmTime){
       return "";
    }

    try {
        return <Tag>
        </Tag>
    }catch (e) {
        console.error(e);
        return "";
    }
};