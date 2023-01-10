import {FB_MESSAGE, MESSAGE_TYPE_TEXT_ATTACHMENTS, PLATFORM_FB, PLATFORM_IG, TICKET_TYPE_MESSAGE} from "../appConst";
import {createConversationId} from "../appHelper";
import {getInstgramSettings} from "./ConfigService";
import {updateOrCreateCustomer} from "./CustomerService";
import {findMessageByMid, lockAndUpdateMessage, updateOrCreateMessage, updateRead} from "./MessageService";
import {createRawData} from "./RawService";
import {updateOrCreateTicket} from "./TicketService";

export const handleFacebookService = async (message) => {
    try {
        const messageString = message.value.toString();
        //Save raw message
        const data = JSON.parse(messageString);
        const {entry} = data;
        entry.forEach(item => {
            const {id, time, messaging} = item;
            //TODO hop_context

            handleMessagingArray(id, time, messaging);
        });
    } catch (e) {
        throw e;
    }
};

/**
 * @param {string} id
 * @param {number} time
 * @param {any} messaging
 * */
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
        //TODO Handle exception here
    }
};

/**
 * @param {string} id
 * @param {number} time
 * @param {any} messaging
 * */
const handleMessage = async (id, time, messaging) => {
    try {
        const {message, postback, reaction, read} = messaging;

        //Truong hop reaction
        if (reaction) {
            await handleReaction(messaging);
        }

        //Truong hop messagin seen
        if (read) {
            await handleRead(messaging);
        }

        //Truong hop message type postback
        if (postback) {
            const rawMessage = await createRawData(PLATFORM_IG, id, time, IG_POSTBACK, JSON.stringify(messaging));
            try {
                await handlePostback(id, messaging);
            } catch (e) {
                rawMessage.isError = true;
                rawMessage.errorMessage = e.message;
                rawMessage.save();
            } finally {
            }
        }

        //Truong hop xu ly message binh thuong
        if (message) {
            let rawMessage = await createRawData(PLATFORM_FB, id, time, FB_MESSAGE, JSON.stringify(messaging));
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
    } catch (e) {
        throw e;
    }
};

const handlePostback = async (messaging) => {
    //TODO postback
};

const handleRead = async (messaging) => {
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

const handleReaction = async (messaging) => {
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

const handleTextAndAttachmentMessage = async (platformId, messaging, rawMessage) => {
    const {sender, recipient, timestamp, message} = messaging;
    const {mid, text, attachments, is_echo = false} = message;
    //VALIDATE
    if (!sender || !recipient) {
        throw new Error("handleTextAndAttachmentMessage: sender or recipient null");
    }
    //UPDATE OR SAVE CUSTOMER
    const c1 = updateOrCreateCustomer(PLATFORM_FB, sender.id);
    const c2 = updateOrCreateCustomer(PLATFORM_FB, recipient.id);

    const [senderCustomer, receiverCustomer] = await Promise.all([c1, c2]);

    //const senderCustomer = await updateOrCreateCustomer(PLATFORM_IG, sender.id);
    //const reciptientCustomer = await updateOrCreateCustomer(PLATFORM_IG, recipient.id);
    try {
        //TRANSACTION HERE
        const messages = await db.sequelize.transaction(async (t) => {
            const messages = null;
            //FIND OR CREATE OPEN TICKET
            const ticket = await updateOrCreateTicket(PLATFORM_FB
                , platformId
                , TICKET_TYPE_MESSAGE
                , createConversationId(senderCustomer, receiverCustomer)
                , senderCustomer.id
            );

            //SAVE MESSAGE FOR TICKET
            const textMessage = await updateOrCreateMessage(PLATFORM_FB, mid);
            textMessage.type = MESSAGE_TYPE_TEXT_ATTACHMENTS;

            await lockAndUpdateMessage(textMessage, ticket.id, rawMessage.id, message);

            //TODO Lock and update ticket here
            if (!ticket.firstMessage) {
                ticket.firstMessage = text ?
                    text :
                    (attachments ? "Customer send Attachment" : "Customer send unsported type");
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

            return messages;
        });
        console.log(messages);
    } catch (e) {
        throw e;
    }
};