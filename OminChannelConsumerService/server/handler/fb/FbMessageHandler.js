import {findMessageByMid, lockAndUpdateMessage, updateOrCreateMessage} from "../../services/MessageService";
import {updateOrCreateCustomer} from "../../services/CustomerService";
import {findLatestAndUnresovledTicketByCustomerId, updateOrCreateTicket} from "../../services/TicketService";
import {
    CONV_TYPE,
    INBOX_TYPE,
    MESSAGE_TYPE_POSTBACK,
    MESSAGE_TYPE_TEXT_ATTACHMENTS,
    PLATFORM_FB,
    TICKET_TYPE_MESSAGE
} from "../../appConst";
import {createConversationId} from "../../appHelper";
import KaffkaClient from "../../KaffkaClient";
import {createCaseFilterQueueJob} from "../../BeeQueueClient";

export const handlePostback = async (platformId, data, rawMessage, isStandBy = false) => {
    //TODO postback
    const {sender, recipient, timestamp, postback} = data;
    const {title, payload, mid} = postback;

    if (!sender || !recipient) {
        throw new Error("handleTextAndAttachmentMessage: sender or recipient null");
    }

    try {
        //UPDATE OR SAVE CUSTOMER
        const c1 = updateOrCreateCustomer(PLATFORM_FB, sender.id);
        const c2 = updateOrCreateCustomer(PLATFORM_FB, recipient.id);

        const [senderCustomer, receiverCustomer] = await Promise.all([c1, c2]);
        //TRANSACTION HERE
        //FIND OR CREATE OPEN TICKET
        console.log("Find Ticket");
        const ticket = await findLatestAndUnresovledTicketByCustomerId(
            PLATFORM_FB
            , platformId
            , TICKET_TYPE_MESSAGE
            , senderCustomer.id
        );

        if (!ticket) {
            return null;
        }

        //SAVE MESSAGE FOR TICKET
        const textMessage = await updateOrCreateMessage(PLATFORM_FB, mid);
        textMessage.type = MESSAGE_TYPE_POSTBACK;
        textMessage.customerId = senderCustomer.id;

        await lockAndUpdateMessage(textMessage, ticket.id, rawMessage.id, postback);

        //TODO Lock and update ticket here
        KaffkaClient.sendFacebook({
            ticketId: ticket.id,
            messageId: textMessage.id,
            isStandBy
        }).catch(e => console.error(e));

        ticket.lcmTime = new Date(timestamp);
        await ticket.save();
        return textMessage;
    } catch (e) {
        console.error(e);
        throw e;
    } finally {
        createCaseFilterQueueJob({
            type: CONV_TYPE.POSTBACK,
            data: data
        });
    }
};

export const handleRead = async (messaging) => {
    // try {
    //     //Todo lock mid
    //     const {sender, read} = messaging;
    //     const {watermark} = read;
    //     const customer = updateOrCreateCustomer(PLATFORM_FB, sender.id);
    //     // await updateRead(PLATFORM_FB, customer.id);
    // } catch (e) {
    //     throw e;
    // }
};

export const handleReaction = async (messaging) => {
    //Todo lock mid
    const {sender, reaction} = messaging;
    const {mid, action, emoji} = reaction;
    try {
        // find by mid
        const message = await findMessageByMid(PLATFORM_FB, mid);
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

export const handleTextAndAttachmentMessage = async (platformId, messaging, rawMessage, isStandBy = false) => {
    const {sender, recipient, timestamp, message} = messaging;
    const {mid, text, attachments, is_echo = false, reply_to, quick_reply} = message;

    //VALIDATE
    if (!sender || !recipient) {
        throw new Error("handleTextAndAttachmentMessage: sender or recipient null");
    }

    try {
        //UPDATE OR SAVE CUSTOMER
        const c1 = updateOrCreateCustomer(PLATFORM_FB, sender.id);
        const c2 = updateOrCreateCustomer(PLATFORM_FB, recipient.id);

        const [senderCustomer, receiverCustomer] = await Promise.all([c1, c2]);
        //TRANSACTION HERE
        //FIND OR CREATE OPEN TICKET
        console.log("create Ticket");
        const ticket = await updateOrCreateTicket(PLATFORM_FB
            , platformId
            , TICKET_TYPE_MESSAGE
            , createConversationId(senderCustomer, receiverCustomer)
            , senderCustomer.id
        );

        console.log("Ticket success");
        //SAVE MESSAGE FOR TICKET
        const textMessage = await updateOrCreateMessage(PLATFORM_FB, mid);
        textMessage.type = MESSAGE_TYPE_TEXT_ATTACHMENTS;
        textMessage.customerId = senderCustomer.id;

        await lockAndUpdateMessage(textMessage, ticket.id, rawMessage.id, message);

        //TODO Lock and update ticket here
        let canSendBot = true;
        if (!quick_reply) {
            canSendBot = false;
            if (!ticket.firstMessage) {
                ticket.firstMessage = text ?
                    text :
                    (attachments ? "Customer send Attachment" : "Customer send unsupported type");
                canSendBot = true;
            }
        }

        if (canSendBot) {
            //Gui thong tin den bot service
            KaffkaClient.sendFacebook({
                ticketId: ticket.id,
                messageId: textMessage.id,
                isStandBy
            }).catch(e => console.log(e));
        }

        if (!is_echo) {
            ticket.lcm = text;
        }

        //Update lrm, lcm time
        if (is_echo) {
            ticket.lrmTime = new Date();
        } else {
            ticket.lcmTime = new Date(timestamp);
        }

        await ticket.save();

        //TODO x??? l?? quick_reply, reply_to

        return textMessage;
    } catch (e) {
        console.error(e);
        throw e;
    } finally {
        //BeeQueue
        if (text) {
            createCaseFilterQueueJob({
                type: CONV_TYPE.INBOX,
                inboxType: INBOX_TYPE.TEXT,
                data: messaging
            });
        } else if (attachments) {
            createCaseFilterQueueJob({
                type: CONV_TYPE.INBOX,
                inboxType: INBOX_TYPE.ATTACHMENT,
                data: messaging
            });
        }
    }
};