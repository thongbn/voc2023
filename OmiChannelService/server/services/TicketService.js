import db from "../models";
import createError from "http-errors";

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