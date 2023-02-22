import db from "../models"

export const findMessageByMid = async (platform, mid) => {
    return await db.Message.findOne({
        where: {
            platform,
            platformId: mid,
        }
    })
};

export const updateOrCreateMessage = async (platform, mid) => {
    //TODO Lock mid
    let model = await findMessageByMid(platform, mid);
    if (!model) {
        model = db.Message.build({
            platform,
            platformId: mid,
            isDeleted: false,
        });
    }

    //TODO May be can get data from mid
    await model.save();
    return model;
};

/**
 * @param {db.Message} message
 * @param {number} ticketId
 * @param {number} rawId
 * @param {any} data
 *
 */
export const lockAndUpdateMessage = async (message, ticketId, rawId, data) => {

    //TODO Raise lock
    const {
        text
        , attachments
        , is_deleted
        , quick_reply
        , reply_to
        , is_echo = false
        , title
        , payload
    } = data;

    if (!is_deleted) {
        let messData = message.data ? JSON.parse(message.data) : {};
        if (text) {
            messData = {
                ...messData,
                text: text
            }
        }
        if (attachments) {
            messData = {
                ...messData,
                attachments
            }
        }
        if (payload) {
            messData = {
                ...messData,
                title,
                payload
            }
        }
        if (quick_reply) {
            messData = {
                ...messData,
                quickReply: quick_reply
            }
        }

        message.data = JSON.stringify(messData);
        message.ticketId = ticketId;
        message.rawId = rawId;

        let otherData = {};
        try {
            otherData = JSON.parse(message.other);
            if (!otherData) {
                otherData = {};
            }
        } catch (e) {
            otherData = {};
        }

        otherData = {
            ...otherData,
            isEcho: is_echo,
        };
        message.other = JSON.stringify(otherData);

        await message.save();
    } else {
        message.isDeleted = true;
    }
};

// export const updateRead = async (platform, customerId) => {
//     return await db.Message.update({
//
//     })
// };