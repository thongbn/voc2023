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