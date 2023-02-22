import {findMessageByMid, lockAndUpdateMessage, updateOrCreateMessage} from "../../services/MessageService";
import {updateOrCreateCustomer} from "../../services/CustomerService";
import {getInstgramSettings} from "../../services/ConfigService";
import db from "../../models";
import {findLatestAndUnresovledTicketByCustomerId, updateOrCreateTicket} from "../../services/TicketService";
import {
    MESSAGE_TYPE_POSTBACK,
    MESSAGE_TYPE_TEXT_ATTACHMENTS,
    PLATFORM_IG,
    TICKET_TYPE_MESSAGE
} from "../../appConst";
import {createConversationId} from "../../appHelper";
import KaffkaClient from "../../KaffkaClient";

export const handleReaction = async (messaging) => {
    //Todo lock mid
    const {sender, reaction} = messaging;
    const {mid, action, emoji} = reaction;
    try {
        // find by mid
        const message = await findMessageByMid(PLATFORM_IG, mid);
        if (!message) {
            throw new Error(`Mid id is not found ${mid}`);
        }

        let otherData = {};
        try {
            otherData = JSON.parse(message.other);
            if (!otherData) {
                otherData = {};
            }
        } catch (e) {
            otherData = {};
        }

        let reactionData = otherData.reaction ? otherData.reaction : [];
        let reactionObj = null;
        const idx = reactionData.findIndex(item => item.sender === sender.id);
        switch (action) {
            case "react":
                reactionObj = {
                    sender: sender.id,
                    emoji
                };
                if (idx === -1) {
                    reactionData.push(reactionObj);
                } else {
                    reactionData[idx] = reactionObj;
                }
                break;
            case "unreact":
                if (idx !== -1) {
                    reactionData.splice(idx, 1);
                }
                break;
            default:
                console.log("Unsupported action", action);
                return;
        }


        otherData = {
            ...otherData,
            reaction: reactionData
        };
        message.other = JSON.stringify(otherData);
        await message.save();
    } catch (e) {
        throw e;
    }
};

export const handlePostback = async (platformId, data, rawMessage, isStandBy = false) => {
    const {sender, recipient, timestamp, postback} = data;
    const {mid} = postback;

    if (!sender || !recipient) {
        throw new Error("handleTextAndAttachmentMessage: sender or recipient null");
    }

    try {
        //UPDATE OR SAVE CUSTOMER
        const c1 = updateOrCreateCustomer(PLATFORM_IG, sender.id);
        const c2 = updateOrCreateCustomer(PLATFORM_IG, recipient.id);

        const [senderCustomer, receiverCustomer] = await Promise.all([c1, c2]);
        //TRANSACTION HERE
        //FIND OR CREATE OPEN TICKET
        console.log("Find Ticket");
        const ticket = await findLatestAndUnresovledTicketByCustomerId(
            PLATFORM_IG
            , platformId
            , TICKET_TYPE_MESSAGE
            , senderCustomer.id
        );

        if (!ticket) {
            return null;
        }

        //SAVE MESSAGE FOR TICKET
        const textMessage = await updateOrCreateMessage(PLATFORM_IG, mid);
        textMessage.type = MESSAGE_TYPE_POSTBACK;
        textMessage.customerId = senderCustomer.id;

        await lockAndUpdateMessage(textMessage, ticket.id, rawMessage.id, postback);

        //TODO Lock and update ticket here
        KaffkaClient.sendInstagram({
            ticketId: ticket.id,
            messageId: textMessage.id,
            isStandBy
        }).catch(e => console.log(e));

        ticket.lcmTime = new Date(timestamp);
        await ticket.save();
        return textMessage;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const handleRead = async (messaging) => {
    try {
        //Todo lock mid
        const {read} = messaging;
        const {mid} = read;
        const message = await findMessageByMid(PLATFORM_IG, mid);
        if (!message) {
            throw new Error(`Mid id is not found ${mid}`);
        }

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
            isRead: true,
        };
        message.other = JSON.stringify(otherData);
        await message.save();
    } catch (e) {
        throw e;
    }
};

export const handleQuickReplyMessage = async (platformId, messaging, rawMessage, isStandBy = false) => {
    const {sender, recipient, timestamp, message} = messaging;
    const {mid} = message;

    if (!sender || !recipient) {
        throw new Error("handleTextAndAttachmentMessage: sender or recipient null");
    }

    try {
        //UPDATE OR SAVE CUSTOMER
        const c1 = updateOrCreateCustomer(PLATFORM_IG, sender.id);
        const c2 = updateOrCreateCustomer(PLATFORM_IG, recipient.id);

        const [senderCustomer, receiverCustomer] = await Promise.all([c1, c2]);
        console.log("Find Ticket");
        const ticket = await findLatestAndUnresovledTicketByCustomerId(
            PLATFORM_IG
            , platformId
            , TICKET_TYPE_MESSAGE
            , senderCustomer.id
        );

        if (!ticket) {
            return null;
        }

        //SAVE MESSAGE FOR TICKET
        const textMessage = await updateOrCreateMessage(PLATFORM_IG, mid);
        textMessage.type = MESSAGE_TYPE_TEXT_ATTACHMENTS;
        textMessage.customerId = senderCustomer.id;
        await lockAndUpdateMessage(textMessage, ticket.id, rawMessage.id, message);

        //TODO Lock and update ticket here
        KaffkaClient.sendInstagram({
            ticketId: ticket.id,
            messageId: textMessage.id,
            isStandBy
        }).catch(e => console.log(e));

        ticket.lcmTime = new Date(timestamp);
        await ticket.save();
        return textMessage;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const handleTextAndAttachmentMessage = async (igId, messaging, rawMessage, isStandBy = false) => {
    const {sender, recipient, timestamp, message} = messaging;
    const {mid, text, attachments, is_deleted} = message;
    //VALIDATE
    if (!sender || !recipient) {
        throw new Error("handleTextAndAttachmentMessage:sender or recipient null");
    }
    //UPDATE OR SAVE CUSTOMER
    const p1 = updateOrCreateCustomer(PLATFORM_IG, sender.id);
    const p2 = updateOrCreateCustomer(PLATFORM_IG, recipient.id);
    const [senderCustomer, receiverCustomer] = await Promise.all([p1, p2]);
    const igSettings = await getInstgramSettings();

    try {
        //TRANSACTION HERE
        const messages = await db.sequelize.transaction(async (t) => {
            let messages = null;
            //FIND OR CREATE OPEN TICKET
            const ticket = await updateOrCreateTicket(PLATFORM_IG, igId, TICKET_TYPE_MESSAGE, createConversationId(senderCustomer, receiverCustomer), senderCustomer.id);

            //SAVE MESSAGE FOR TICKET
            const textMessage = await updateOrCreateMessage(PLATFORM_IG, mid);
            textMessage.type = MESSAGE_TYPE_TEXT_ATTACHMENTS;
            let isFirstMessage = false;
            if (!is_deleted) {
                let messData = textMessage.data ? JSON.parse(textMessage.data) : {};
                if (text) {
                    messData = {
                        ...messData,
                        text: text
                    };
                    //Update new information ticket
                    //Define page or customer;
                    if (!ticket.firstMessage) {
                        ticket.firstMessage = text;
                        isFirstMessage = true;
                    }

                    if (igSettings.pageId != sender.id) {
                        ticket.lcm = text;
                    }

                }
                if (attachments) {
                    messData = {
                        ...messData,
                        attachments
                    };
                    if (!ticket.firstMessage) {
                        ticket.firstMessage = "Customer send Attachment";
                        isFirstMessage = true;
                    }
                }

                textMessage.data = JSON.stringify(messData);
                textMessage.customerId = senderCustomer.id;
                textMessage.ticketId = ticket.id;
                textMessage.rawId = rawMessage.id;
                await textMessage.save();

                if (isFirstMessage) {
                    KaffkaClient.sendInstagram({
                        ticketId: ticket.id,
                        messageId: textMessage.id,
                        isStandBy
                    }).catch(e => console.log(e));
                }
                messages = textMessage;
            } else {
                textMessage.isDeleted = true;
            }

            if (igSettings.pageId == sender.id) {
                ticket.lrmTime = new Date();
            } else {
                ticket.lcmTime = new Date(timestamp);
            }

            await ticket.save();

            return messages;
        });
        console.log(messages);
    } catch (e) {
        console.error(e);
        throw e;
    }
};