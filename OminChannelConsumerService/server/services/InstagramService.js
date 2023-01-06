import { IG_MESSAGE, IG_POSTBACK, MESSAGE_TYPE_ATTACHMENTS, MESSAGE_TYPE_TEXT, PLATFORM_IG, TICKET_TYPE_MESSAGE } from "../appConst";
import { createConversationId } from "../appHelper";
import db from "../models";
import { getInstgramSettings } from "./ConfigService";
import { updateOrCreateCustomer } from "./CustomerService";
import { updateOrCreateMessage } from "./MessageService";
import { createRawData } from "./RawService";
import { updateOrCreateTicket } from "./TicketService";

export const handleInstagramService = (message) => {
    try {
        const messageString = message.value.toString();
        console.log("handleIG", messageString);
        //Save raw message
        const data = JSON.parse(messageString);
        const { entry } = data;
        entry.forEach(item => {
            const { id, time, messaging } = item;
            handleMessagingArray(id, time, messaging);
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
    try {
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
            let rawMessage = await createRawData(PLATFORM_IG, id, time, IG_MESSAGE, JSON.stringify(messaging));
            try {
                const messages = await handleTextAndAttachmentMessage(id, messaging, rawMessage);
                // rawMessage.messageId = message?.id;
            } catch (e) {
                rawMessage.isError = true;
                rawMessage.errorMessage = e.message;
                rawMessage.save();
            } finally {
            }
        }

        //TODO xu ly truong hop referrer neu can
    } catch (e) {
        throw e;
    }
}

const handleReaction = async (reaction) => {
    const { mid, action, emoji } = reaction;
    try {

    } catch (e) {
        throw e;
    }
}

const handlePostback = async () => {

}

const handleRead = async () => {

}

const handleTextAndAttachmentMessage = async (igId, messaging, rawMessage) => {
    const { sender, recipient, timestamp, message } = messaging;
    const { mid, text, attachments, is_deleted, quick_reply, reply_to } = message;
    //VALIDATE
    if (!sender || !recipient) {
        throw new Error("handleTextAndAttachmentMessage:", "sender or recipient null");
    }
    //UPDATE OR SAVE CUSTOMER
    const senderCustomer = await updateOrCreateCustomer(PLATFORM_IG, sender.id);
    const reciptientCustomer = await updateOrCreateCustomer(PLATFORM_IG, recipient.id);
    const igSettings = await getInstgramSettings();

    try {
        //TRANSACTION HERE
        const messages = await db.sequelize.transaction(async (t) => {
            const messages = [];
            //FIND OR CREATE OPEN TICKET
            const ticket = await updateOrCreateTicket(PLATFORM_IG, igId, TICKET_TYPE_MESSAGE, createConversationId(senderCustomer, reciptientCustomer), senderCustomer.id);

            //SAVE MESSAGE FOR TICKET
            if (text) {
                //create text message
                const textMessage = await updateOrCreateMessage(PLATFORM_IG, mid);
                textMessage.type = MESSAGE_TYPE_TEXT;
                textMessage.data = JSON.stringify({
                    text
                });
                textMessage.customerId = senderCustomer.id;
                textMessage.ticketId = ticket.id;
                textMessage.rawId = rawMessage.id;
                await textMessage.save();
                messages.push(textMessage);

                //Update new information ticket
                //Define page or customer;
                if (!ticket.firstMessage) {
                    ticket.firstMessage = text;
                }

                if (igSettings.pageId != sender.id) {
                    ticket.lcm = text;
                }
            }

            if (attachments) {
                const attachmentMessages = await Promise.all(attachments.map(async item => {
                    const mes = await updateOrCreateMessage(PLATFORM_IG, mid);
                    mes.type = MESSAGE_TYPE_ATTACHMENTS;
                    mes.data = JSON.stringify(item);
                    mes.customerId = senderCustomer.id;
                    mes.ticketId = ticket.id;
                    mes.rawId = rawMessage.id;
                    await mes.save();
                    return mes;
                }));
                if (!ticket.firstMessage) {
                    ticket.firstMessage = "Customer send Attachment";
                }
                messages.push(...attachmentMessages);
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
        throw e;
    }
}