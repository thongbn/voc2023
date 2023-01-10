import { IG_MESSAGE, IG_POSTBACK, MESSAGE_TYPE_TEXT_ATTACHMENTS, PLATFORM_IG, TICKET_TYPE_MESSAGE } from "../appConst";
import { createConversationId } from "../appHelper";
import db from "../models";
import { getInstgramSettings } from "./ConfigService";
import { updateOrCreateCustomer } from "./CustomerService";
import { findMessageByMid, updateOrCreateMessage } from "./MessageService";
import { createRawData } from "./RawService";
import { updateOrCreateTicket } from "./TicketService";

export const handleInstagramService = (message) => {
    try {
        const messageString = message.value.toString();
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
            } catch (e) {
                rawMessage.isError = true;
                rawMessage.errorMessage = e.message;
                rawMessage.save();
            } finally {
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

const handleReaction = async (messaging) => {
    //Todo lock mid
    const { sender, recipient, timestamp, reaction } = messaging;
    const { mid, action, emoji } = reaction;
    try {
        // find by mid
        const message = await findMessageByMid(PLATFORM_IG, mid);
        if (!message) {
            throw new Error("Mid id is not found", mid);
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
}

const handlePostback = async () => {
    //TODO postback
}

const handleRead = async (messaging) => {
    try {
        //Todo lock mid
        const { read } = messaging;
        const { mid } = read;
        const message = await findMessageByMid(PLATFORM_IG, mid);
        if (!message) {
            throw new Error("Mid id is not found", mid);
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
        }
        message.other = JSON.stringify(otherData);
        await message.save();
    } catch (e) {
        throw e;
    }
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
            const messages = null;
            //FIND OR CREATE OPEN TICKET
            const ticket = await updateOrCreateTicket(PLATFORM_IG, igId, TICKET_TYPE_MESSAGE, createConversationId(senderCustomer, reciptientCustomer), senderCustomer.id);

            //SAVE MESSAGE FOR TICKET
            const textMessage = await updateOrCreateMessage(PLATFORM_IG, mid);
            textMessage.type = MESSAGE_TYPE_TEXT_ATTACHMENTS;
            if (!is_deleted) {
                let messData = textMessage.data ? JSON.parse(textMessage) : {};
                if (text) {
                    messData = {
                        ...messData,
                        text: text
                    }

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
                    messData = {
                        ...messData,
                        attachments
                    }
                    if (!ticket.firstMessage) {
                        ticket.firstMessage = "Customer send Attachment";
                    }
                }

                textMessage.data = JSON.stringify(messData);
                textMessage.customerId = senderCustomer.id;
                textMessage.ticketId = ticket.id;
                textMessage.rawId = rawMessage.id;
                await textMessage.save();
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
        throw e;
    }
}