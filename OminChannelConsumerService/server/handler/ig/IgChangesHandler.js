import {updateOrCreateTicketComment} from "../../services/TicketService";
import {MESSAGE_TYPE_TEXT_ATTACHMENTS, PLATFORM_IG} from "../../appConst";
import {updateOrCreateCustomer} from "../../services/CustomerService";
import {updateOrCreateMessage} from "../../services/MessageService";

export const handleChangeItem = async (id, time, changeItem) => {
    try {
        const {field, value} = changeItem;
        switch (field) {
            case "comments": {
                await handleComment(id, time, value);
                break;
            }
            default:
                console.log(`handleChangeItem | field: ${field} not supported`);
                break;
        }
    } catch (e) {
        throw e;
    }
};

const handleComment = async (platformId, time, value) => {
    try {
        const {from, media, id, parent_id, text} = value;
        //Truong hop co parent_id --> tim ticket tuong ung luu media id vao ticket
        let ticket = null;
        const customer = await updateOrCreateCustomer(PLATFORM_IG, from.id);
        if (parent_id) {
            ticket = await updateOrCreateTicketComment(PLATFORM_IG, platformId, parent_id, customer.id, media.id);
        } else {
            ticket = await updateOrCreateTicketComment(
                PLATFORM_IG,
                platformId,
                id,
                customer.id,
                media.id
            )
        }

        const textMessage = await updateOrCreateMessage(PLATFORM_IG, id);
        textMessage.type = MESSAGE_TYPE_TEXT_ATTACHMENTS;
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
                await ticket.save();
            }
        }

        textMessage.data = JSON.stringify(messData);
        textMessage.customerId = customer.id;
        textMessage.ticketId = ticket.id;
        await textMessage.save();
        console.log(textMessage);
    } catch (e) {
        throw e;
    }
};
