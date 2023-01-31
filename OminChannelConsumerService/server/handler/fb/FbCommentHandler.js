import {createRawData} from "../../services/RawService";
import {updateOrCreateCustomer} from "../../services/CustomerService";
import {MESSAGE_TYPE_TEXT_ATTACHMENTS, PLATFORM_FB, PLATFORM_IG} from "../../appConst";
import {updateOrCreateTicketComment} from "../../services/TicketService";
import {updateOrCreateMessage} from "../../services/MessageService";

export const handleCommentArray = (id, time, changes) => {
    try {
        changes.forEach(item => {
            handleChange(id, time, item)
                .catch(e => {
                    console.error(e);
                });
        })
    } catch (e) {
        console.error(e);
        //TODO Handle exception here
    }
};

const handleChange = async (id, time, change) => {
    const {value, field} = change;
    if (!value) {
        console.error("Unknown change", change);
        return;
    }

    //Save customer
    //switch field and item and verb
    switch (field) {
        case "feed":
            await handleFeed(id, time, value);
            break;
        default:
            console.log("Un-supported field", field);
            break;
    }
};

const handleFeed = async (id, time, feed) => {
    const {item} = feed;
    switch (item) {
        case "comment":
            await handleComment(id, time, feed);
            break;
        default:
            console.log("Un-supported item", item);
            break;
    }
};

const handleComment = async (platformId, time, comment) => {
    try {
        let ticket = null;
        const {from, parent_id, comment_id, post_id, verb, message} = comment;
        const customer = await updateOrCreateCustomer(PLATFORM_FB, from.id);
        customer.name = from.name;

        if(parent_id === post_id){
            ticket = await updateOrCreateTicketComment(PLATFORM_FB, platformId, comment_id, customer.id, post_id);
        }else{
            ticket = await updateOrCreateTicketComment(PLATFORM_FB, platformId, parent_id, customer.id, post_id);
        }
        const ticketMessage = await updateOrCreateMessage(PLATFORM_FB, comment_id);
        switch (verb) {
            case "add":
            case "edit":
                ticketMessage.type = MESSAGE_TYPE_TEXT_ATTACHMENTS;
                ticketMessage.ticketId = ticket.id;
                ticketMessage.customerId = customer.id;
                await updateCommentDetailByApi(PLATFORM_FB, comment_id, ticketMessage);
                break;
            case "delete":
                ticketMessage.isDeleted = true;
                ticketMessage.ticketId = ticket.id;
                ticketMessage.customerId = customer.id;
                break;
            default:
                console.log("Un-supported verb", verb);
                break;
        }

        ticketMessage.save();
        //Update first message ticket
        if (message) {
            if (!ticket.firstMessage) {
                ticket.firstMessage = message;
                await ticket.save();
            }
        } else {
            if (!ticket.firstMessage) {
                ticket.firstMessage = "Sticker comment | Attachment comment";
                await ticket.save();
            }
        }

        //TODO Save post
        console.log(ticketMessage);
    } catch (e) {
        throw e;
    }

};

const updateCommentDetailByApi = async (platform, commentId, ticketMessage) => {
    //TODO implement here
};
