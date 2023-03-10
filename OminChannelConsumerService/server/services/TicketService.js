import {Op} from "sequelize";
import db from "../models"
import {TICKET_CASE_STATUS_DONE, TICKET_CASE_STATUS_NEW, TICKET_TYPE_COMMENT, TICKET_TYPE_RATINGS} from "../appConst";
import KaffkaClient from "../KaffkaClient";

export const findLatestAndUnresovledTicketByCustomerId = async (platform, platformId, type, customerId) => {
    return await db.Ticket.findOne({
        where: {
            platform,
            platformId,
            customerId,
            type,
            caseStatus: {
                [Op.ne]: TICKET_CASE_STATUS_DONE
            }
        }
    });
};

export const findLatestAndUnresovledTicketByUniqueId = async (platform, platformId, type, cId) => {
    return await db.Ticket.findOne({
        where: {
            platform,
            platformId,
            cId,
            type,
            caseStatus: {
                [Op.ne]: TICKET_CASE_STATUS_DONE
            }
        }
    });
};

/**
 *
 * @param {string} platform
 * @param {string} platformId
 * @param {string} type
 * @param {string} cId
 * @param {number} customerId
 * @returns {Ticket}
 */
export const updateOrCreateTicket = async (platform, platformId, type, cId, customerId) => {
    //TODO Redis lock to customer ticket to find
    let model = await findLatestAndUnresovledTicketByUniqueId(platform, platformId, type, cId);
    if (!model) {
        model = db.Ticket.build({
            platform,
            platformId,
            cId,
            customerId,
            type,
            caseStatus: TICKET_CASE_STATUS_NEW,
        });
        await model.save();
    }
    return model;
};

export const updateOrCreateTicketComment = async (platform, platformId, cId, customerId, mediaId) => {
    let model = await db.Ticket.findOne({
        where: {
            platform,
            platformId,
            type: TICKET_TYPE_COMMENT,
            cId
        }
    });
    if (!model) {
        model = await db.Ticket.build({
            platform,
            platformId,
            cId,
            customerId,
            mediaId,
            type: TICKET_TYPE_COMMENT,
            caseStatus: TICKET_CASE_STATUS_NEW,
        });
        await model.save();
    }
    return model;
};

export const updateOrCreateTicketRating = async (platform, platformId, openGraphStory, customerId) => {
    let model = await db.Ticket.findOne({
        where: {
            platform,
            platformId,
            type: TICKET_TYPE_RATINGS,
            cId: openGraphStory
        }
    });
    if (!model) {
        model = db.Ticket.build({
            platform,
            platformId,
            cId: openGraphStory,
            customerId,
            mediaId: openGraphStory,
            type: TICKET_TYPE_RATINGS,
            caseStatus: TICKET_CASE_STATUS_NEW,
        });
        await model.save();
    }
    return model;
};