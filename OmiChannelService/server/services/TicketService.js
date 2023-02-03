import db from "../models";
import createError from "http-errors";
import {PLATFORM_IG, TICKET_TYPE_COMMENT, TICKET_TYPE_MESSAGE, TICKET_TYPE_RATINGS} from "../helper/appConst";
import {graphApiPost} from "../helper/graph-helper";
import {getFacebookSettings} from "./ConfigService";

export const getTicketById = async (id, includes = []) => {
    const model = await db.Ticket.findOne({
        where: {
            id
        },
        include: includes
    });
    if (!model) {
        throw createError(404, "Record not found")
    }

    return model;
};

export const replayFacebook = async (ticket, data) => {
    switch (ticket.type) {
        case TICKET_TYPE_MESSAGE: {
            return await replyFacebookMessage(ticket, data);
        }
        case TICKET_TYPE_COMMENT:
        case TICKET_TYPE_RATINGS: {
            return await replyFacebookComment(ticket, data);
        }
        default:
            throw createError(400, `Platform ${ticket.type} not supported`);
    }
};

export const replayIg = async (ticket, data) => {
    switch (ticket.type) {
        case TICKET_TYPE_MESSAGE: {
            return await replyIgMessage(ticket, data);
        }
        case TICKET_TYPE_COMMENT: {
            return await replyIgComment(ticket, data);
        }
        default:
            throw createError(400, `Platform ${ticket.type} not supported`);
    }
};

export const replyFacebookComment = async (ticket, data) => {
    const {message, attachments} = data;
    if (!message && (!attachments || attachments.length === 0)) {
        throw createError(400, `Message or attachment should not be null`);
    }

    let returnData = [];
    let errorDatas = [];
    let formsDatas = [];
    let bodyFormData = new URLSearchParams();
    if (message) {
        bodyFormData.append('message', message);
    }

    if (attachments.length > 0) {
        formsDatas = attachments.map((item, idx) => {
            if (idx === 0) {
                bodyFormData.append('attachment_url', `${process.env.RESOURCE_BASE_URL}${item.path}`);
                return bodyFormData;
            }
            let imgFd = new URLSearchParams();
            imgFd.append('attachment_url', `${process.env.RESOURCE_BASE_URL}${item.path}`);
            return imgFd;
        });
    } else {
        formsDatas.push(bodyFormData);
    }

    for (let i = 0; i < formsDatas.length; i++) {
        try {
            const res = await graphApiPost(
                `/${ticket.cId}/comments`,
                formsDatas[i]);
            returnData.push(res);
        } catch (e) {
            console.error(e);
            errorDatas.push(e.message);
        }
    }

    return {
        data: returnData,
        errors: errorDatas
    };
};

export const replyFacebookMessage = async (ticket, data) => {

};

export const replyIgComment = async (ticket, data) => {
    const {message} = data;
    if (!message) {
        throw createError(400, `Message should not be null`);
    }

    const res = await graphApiPost(
        `/${ticket.cId}/replies`, null, "page", {
            message
        });

    return res.data;
};

export const replyIgMessage = async (ticket, data) => {
    const {message, attachments} = data;
    if (!message && (!attachments || attachments.length === 0)) {
        throw createError(400, `Message or attachment should not be null`);
    }

    let customer = await db.Customer.findOne({
        where: {
            id: ticket.customerId,
            platform: PLATFORM_IG,
        },
        attributes: ['id', 'platformId']
    });
    if (!customer || !customer.platformId) {
        throw createError(400, `Customer not found`);
    }

    const fbSettings = await getFacebookSettings();
    if(!fbSettings || !fbSettings.pageId){
        throw createError(400, `PageId not found`);
    }

    let returnData = [];
    let errorDatas = [];
    let formsDatas = [];
    if (message) {
        let messageData = {
            recipient: `{"id": "${customer.platformId}"}`,
            message: `{"text": "${message}"}`
        };
        formsDatas.push(messageData);
    }

    if (attachments.length > 0) {
        formsDatas.push(...attachments.map((item, idx) => {
            return {
                recipient: `{"id": "${customer.platformId}"}`,
                message: `{
                    'attachment':{
                        'type': '${getIgTypeByMime(item.mime)}',
                        'payload': {'url':'${process.env.RESOURCE_BASE_URL}${item.path}'}
                    }
                }`
            };
        }));
    }

    for (let i = 0; i < formsDatas.length; i++) {
        try {
            const res = await graphApiPost(
                `/${fbSettings.pageId}/messages`,
                {}, "page", {
                    ...formsDatas[i]
                });
            returnData.push(res);
        } catch (e) {
            console.error(e);
            errorDatas.push(e.message);
        }
    }

    return {
        data: returnData,
        errors: errorDatas
    };
};

const getIgTypeByMime = (mime) => {
    switch (mime) {
        case "image/png":
        case "image/jpeg":
            return "image";
        case "video/mp4":
        case "application/mp4":
        case "application/x-mpegURL":
        case "video/x-msvideo":
        case "video/quicktime":
            return "video";
        case "audio/mp4":
        case "audio/x-wav":
            return "audio";
        default:
            throw createError(400, "Not support mime: " + mime);
    }
};