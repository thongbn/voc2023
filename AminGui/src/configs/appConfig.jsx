import {RiInstagramLine, RiFacebookLine, RiSendPlaneLine} from "react-icons/ri";
import {Tooltip} from "antd";
import React from "react";

export const TRANS_LOG_TYPE = {
    "1_income": {
        name: "Thu nhập",
        color: "success"
    },
    "2_rollback": {
        name: "Hủy",
        color: "default"
    },
};

export const TRANS_PAID_STATUS = {
    "1_waiting": {
        name: "Chờ",
        color: "warning"
    },
    "2_done": {
        name: "Hoàn thành",
        color: "success"
    },
    "3_cancel": {
        name: "Hủy",
        color: "default"
    },
};

export const CASE_TYPE_MESSAGE = "message";
export const CASE_TYPE_COMMENT = "comment";
export const CASE_TYPE_RATING = "ratings";
export const CASE_TYPE_CUSTOM = "custom";
export const CASE_TYPE_FEEDBACK = "feedback";
export const CASE_TYPES = {
    message: {
        name: "Inbox",
    },
    comment: {
        name: "Comment"
    },
    ratings: {
        name: "Rating"
    },
    custom: {
        name: "Custom"
    },
    feedback: {
        name: "Feedback"
    },
};

export const PLATFORM_IG = "ig";
export const PLATFORM_ZL = "zl";
export const PLATFORM_FB = "fb";
export const PLATFORMS = {
    "ig": {
        name: "Instagram",
        icon: <Tooltip title="Instagram">
            <RiInstagramLine className="remix-icon"/>
        </Tooltip>
    },
    "fb": {
        name: "Facebook",
        icon: <Tooltip title="Facebook">
            <RiFacebookLine className="remix-icon"/>
        </Tooltip>
    },
    "zl": {
        name: "Zalo",
        color: <Tooltip title="Zalo">
            <RiSendPlaneLine className="remix-icon"/>
        </Tooltip>
    },
};

export const CASE_STATUS_NEW = "1_new";
export const CASE_STATUS_PROCESSING = "2_processing";
export const CASE_STATUS_DONE = "3_done";
export const CASE_STATUS = {
    "1_new": {
        name: "New",
        color: "primary",
    },
    "2_processing": {
        name: "Progressing",
        color: "volcano",
    },
    "3_done": {
        name: "Done",
        color: "default",
    },
};

export const MESSAGE_TYPE_TEXT_ATTACHMENT = "text_attachments";
export const MESSAGE_TYPE_RATINGS = "ratings";
export const MESSAGE_TYPE_POSTBACK = "postback";
export const MESSAGE_TYPE = {

};