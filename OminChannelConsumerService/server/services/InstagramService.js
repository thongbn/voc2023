import { IG_MESSAGE, IG_POSTBACK, MESSAGE_TYPE_ATTACHMENTS, MESSAGE_TYPE_TEXT, PLATFORM_IG, TICKET_TYPE_MESSAGE } from "../appConst";
import db from "../models";
import { updateOrCreateCustomer } from "./CustomerService";
import { updateOrCreateMessage } from "./MessageService";
import { createRawData } from "./RawService";
import { updateOrCreateTicket } from "./TicketService";

export const handleInstagramService = async (message) => {
    try {
        const messageString = message.value.toString();
        console.log("handleIG", messageString);
        //Save raw message
        const data = JSON.parse(messageString);
        const { entry } = data;
        entry.forEach(item => {
            const { id, time, messaging } = item;
            handleMessagingArray(id, time, messaging)
                .catch(e => {
                    console.error(e);
                });
        });
    } catch (e) {
        throw e;
    }
}

const handleMessagingArray = (id, time, messaging) => {
    try {
        messaging.forEach(item => {
            handleMessage(id, time, item)
                .catch(e => {
                    console.error(e);
                });
        })
    } catch (e) {
        console.error(e);
    }
}

const handleMessage = async (id, time, messaging) => {
    const { sender, recipient, timestamp, message, reaction, postback, refferal, read } = messaging;

    //Truong hop reaction  
    if (reaction) {
        await handleReaction(messaging);
    }

    //Truong hop message type postback
    if (postback) {
        const rawMessage = await createRawData(PLATFORM_IG, id, time, IG_POSTBACK, JSON.stringify(messaging));
        try {
            const message = await handlePostback(id, messaging);
            rawMessage.messageId = message?.id;
        } catch (e) {
            rawMessage.isError = true;
            rawMessage.errorMessage = e.message;
        } finally {
            rawMessage.save();
        }
    }

    //Truong hop messagin seen
    if (read) {
        await handleRead(messaging);
    }

    //Truong hop xu ly message binh thuong
    if (message) {
        const rawMessage = await createRawData(PLATFORM_IG, id, time, IG_MESSAGE, JSON.stringify(messaging));
        try {
            const message = await handleTextAndAttachmentMessage(id, messaging);
            rawMessage.messageId = message?.id;
        } catch (e) {
            rawMessage.isError = true;
            rawMessage.errorMessage = e.message;
        } finally {
            rawMessage.save();
        }
    }

    //TODO xu ly truong hop referrer neu can
}

const handleReaction = async () => {

}

const handlePostback = async () => {

}

const handleRead = async () => {

}

const handleTextAndAttachmentMessage = async (igId, messaging) => {
    const { sender, recipient, timestamp, message } = messaging;
    const { mid, text, attachments, is_deleted, quick_reply, reply_to } = message;
    //VALIDATE
    if (!sender || !recipient) {
        throw new Error("handleTextAndAttachmentMessage:", "sender or recipient null");
    }
    //UPDATE OR SAVE CUSTOMER
    const customer = await updateOrCreateCustomer(PLATFORM_IG, sender.id);

    try {
        //TRANSACTION HERE
        const messages = await db.sequelize.transaction(async (t) => {
            const messages = [];
            //FIND OR CREATE OPEN TICKET
            const ticket = await updateOrCreateTicket(PLATFORM_IG, igId, TICKET_TYPE_MESSAGE, customer.id);

            //SAVE MESSAGE FOR TICKET
            if (text) {
                //create text message
                const textMessage = await updateOrCreateMessage(PLATFORM_IG, mid);
                textMessage.type = MESSAGE_TYPE_TEXT;
                textMessage.data = JSON.stringify({
                    text
                });
                textMessage.customerId = customer.id;
                textMessage.ticketId = ticket.id;
                await textMessage.save();
                messages.push(textMessage);
            }

            if (attachments) {
                const attachmentMessages = await Promise.all(attachments.map(async item => {
                    const mes = await updateOrCreateMessage(PLATFORM_IG, mid);
                    mes.type = MESSAGE_TYPE_ATTACHMENTS;
                    mes.data = JSON.stringify(item);
                    mes.customerId = customer.id;
                    mes.ticketId = ticket.id;
                    await mes.save();
                    return mes;
                }));
                messages.push(...attachmentMessages);
            }
            return messages;
        });
        console.log(messages);
    } catch (e) {
        throw e;
    }
}