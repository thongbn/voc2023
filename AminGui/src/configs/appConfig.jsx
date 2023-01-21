import {RiInstagramLine, RiFacebookLine, RiSendPlaneLine} from "react-icons/ri";
import React from "react";

export const APPOINTMENT_STATUS = {
    NEW: "1_new",
    IN_PROGRESS: "2_in_progress",
    ORDER_CREATED: "3_order_created",
    CONTACT_FAILED: "4_contact_failed",
};

export const ORDER_PAID_STATUS = {
    WAITING: "1_waiting",
    DONE: "2_done",
    CANCEL: "3_cancel",
};

export const ORDER_CONFIRM_STATUS = {
    "1_waiting": {
        name: "Chờ",
        color: "warning"
    },
    "2_confirm": {
        name: "Hoàn thành",
        color: "success"
    },
    "3_cancel": {
        name: "Hủy",
        color: "default"
    },
};

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

export const PLATFORMS = {
    "ig": {
        name: "Instagram",
        icon: <RiInstagramLine className="remix-icon"/>
    },
    "fb": {
        name: "Hoàn thành",
        icon: <RiFacebookLine className="remix-icon"/>
    },
    "zl": {
        name: "Zalo",
        color: <RiSendPlaneLine  className="remix-icon"/>
    },
};

export const CASE_STATUS_NEW = "1_new";
export const CASE_STATUS_PROGRESSING = "2_progressing";
export const CASE_STATUS_DONE = "3_done";
export const CASE_STATUS = {
    "1_new": {
        name: "New",
        color: "info",
    },
    "2_progressing": {
        name: "Progressing",
        color: "warning",
    },
    "3_done": {
        name: "Done",
        color: "success",
    },
};