import db from "../models";

export const getMessageByTicketId = (ticketId, includes) => {
    return db.Message.findAll({
        where: {
            ticketId
        },
        orderBy: ['id asc'],
        include: includes
    });
};