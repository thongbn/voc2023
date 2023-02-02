import db from "../models";
import createError from "http-errors";
import {
    FB_COMMENT,
    FB_MESSAGE,
    IG_MESSAGE, MESSAGE_TYPE_TEXT_ATTACHMENTS,
    PLATFORM_FB,
    TICKET_TYPE_COMMENT,
    TICKET_TYPE_MESSAGE
} from "../helper/appConst";
import {graphApiGet, graphApiPost} from "../helper/graph-helper";

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
        case TICKET_TYPE_COMMENT: {
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
        throw createError(400, `Platform ${ticket.type} not supported`);
    }

    let returnData = [];
    let formsDatas = [];
    let bodyFormData = new URLSearchParams();
    if (message) {
        bodyFormData.append('message', message);
    }

    if (attachments.length > 0) {
        formsDatas = attachments.map((item, idx) => {
            if(idx === 0){
                bodyFormData.append('attachment_url', `${process.env.RESOURCE_BASE_URL}${item.path}`);
                return bodyFormData;
            }
            let imgFd = new URLSearchParams();
            imgFd.append('attachment_url', `${process.env.RESOURCE_BASE_URL}${item.path}`);
            return imgFd;
        });
    }else{
        formsDatas.push(bodyFormData);
    }

    for (let i = 0; i < formsDatas.length; i ++){
        try{
            const res = await graphApiPost(
                `/${ticket.cId}/comments`,
                formsDatas[i]);
            returnData.push(res);
        }catch (e) {
            console.error(e);
        }
    }

    return returnData;
};

export const replyFacebookMessage = async (ticket, data) => {

};

export const replyIgComment = async (ticket, data) => {

};

export const replyIgMessage = async (ticket, data) => {

};