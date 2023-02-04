import {createRawData} from "../../services/RawService";
import {updateOrCreateCustomer} from "../../services/CustomerService";
import {MESSAGE_TYPE_RATINGS, MESSAGE_TYPE_TEXT_ATTACHMENTS, PLATFORM_FB, PLATFORM_IG} from "../../appConst";
import {updateOrCreateTicketComment, updateOrCreateTicketRating} from "../../services/TicketService";
import {updateOrCreateMessage} from "../../services/MessageService";
import {getCommentDetail, getOpenStoryDetail} from "../../services/GraphApiService";

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
        case "ratings":
            await handleRating(id, time, value);
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

const handleRating = async (id, time, rating) => {
    try {
        const {item} = rating;
        switch (item) {
            case "rating":
                await handleItemRating(id, time, rating);
                break;
            case "comment":
                await handleItemCommentRating(id, time, rating);
                break;
            default:
                console.log("Un-supported item", item);
        }


    } catch (e) {

    }
};

const handleItemCommentRating = async (id, time, rating) => {
    try {
        let ticket;
        const {
            comment_id,
            open_graph_story_id,
            message,
            sender_id,
            verb
        } = rating;

        const customer = await updateOrCreateCustomer(PLATFORM_FB, sender_id);

        ticket = await updateOrCreateTicketRating(PLATFORM_FB, id, open_graph_story_id, customer.id);

        const ticketMessage = await updateOrCreateMessage(PLATFORM_FB, comment_id);

        switch (verb) {
            case "add":
            case "edit": {
                ticketMessage.type = MESSAGE_TYPE_TEXT_ATTACHMENTS;
                ticketMessage.ticketId = ticket.id;
                ticketMessage.customerId = customer.id;
                await ticketMessage.save();
                await updateCommentDetailByApi(comment_id, ticketMessage);
                break;
            }
            case "delete": {
                ticketMessage.isDeleted = true;
                ticketMessage.ticketId = ticket.id;
                ticketMessage.customerId = customer.id;
                await ticketMessage.save();
                break;
            }
            default:
                console.log("Un-supported verb", verb);
                return;
        }

        if (!ticket.firstMessage) {
            if (message) {
                ticket.firstMessage = message;
            } else {
                ticket.firstMessage = "Un-get reviewer-text";
            }
            await ticket.save();
        }

        //TODO Save post
        console.log(ticketMessage);
    } catch (e) {
        throw e;
    }
};

const handleItemRating = async (id, time, rating) => {
    try {
        let ticket;
        const {review_text, open_graph_story_id, recommendation_type, reviewer_id, reviewer_name, verb} = rating;

        if (['add', 'delete'].findIndex(item => item === verb) < 0) {
            console.log("Un-supported verb", verb);
            return;
        }

        const customer = await updateOrCreateCustomer(PLATFORM_FB, reviewer_id, reviewer_name, false);
        ticket = await updateOrCreateTicketRating(PLATFORM_FB, id, open_graph_story_id, customer.id);
        const ticketMessage = await updateOrCreateMessage(PLATFORM_FB, reviewer_id);

        switch (verb) {
            case "add":
                //TODO truong hop case edit ktr lai case "edit":
            {
                ticketMessage.type = MESSAGE_TYPE_RATINGS;
                ticketMessage.ticketId = ticket.id;
                ticketMessage.customerId = customer.id;
                ticketMessage.data = JSON.stringify({
                    text: review_text,
                    recommendationType: recommendation_type
                });
                await ticketMessage.save();
                break;
            }
            case "delete": {
                if (ticketMessage.customerId === customer.id) {
                    ticketMessage.isDeleted = true;
                    ticketMessage.ticketId = ticket.id;
                    ticketMessage.customerId = customer.id;
                    await ticketMessage.save();
                }
                break;
            }
            default:
                console.log("Un-supported verb", verb);
                return;
        }

        //Update first message ticket
        if (!ticket.firstMessage) {
            ticket.firstMessage = review_text;
            await ticket.save();
        }
        //TODO Save post
        console.log(ticketMessage);
    } catch (e) {
        throw e;
    }
};

const handleComment = async (platformId, time, comment) => {
    try {
        let ticket = null;
        const {from, parent_id, comment_id, post_id, verb, message} = comment;
        const customer = await updateOrCreateCustomer(PLATFORM_FB, from.id);
        customer.name = from.name;

        if (parent_id === post_id) {
            ticket = await updateOrCreateTicketComment(PLATFORM_FB, platformId, comment_id, customer.id, post_id);
        } else {
            ticket = await updateOrCreateTicketComment(PLATFORM_FB, platformId, parent_id, customer.id, post_id);
        }
        const ticketMessage = await updateOrCreateMessage(PLATFORM_FB, comment_id);
        switch (verb) {
            case "add":
            case "edit":
            case "edited":
                ticketMessage.type = MESSAGE_TYPE_TEXT_ATTACHMENTS;
                ticketMessage.ticketId = ticket.id;
                ticketMessage.customerId = customer.id;
                await ticketMessage.save();
                await updateCommentDetailByApi(comment_id, ticketMessage);
                break;
            case "delete":
                ticketMessage.isDeleted = true;
                ticketMessage.ticketId = ticket.id;
                ticketMessage.customerId = customer.id;
                await ticketMessage.save();
                break;
            default:
                console.log("Un-supported verb", verb);
                return;
        }

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

const updateCommentDetailByApi = async (commentId, ticketMessage) => {
    //TODO implement here
    const commentData = await getCommentDetail(commentId);
    const {message, attachment} = commentData;
    let ticketData = ticketMessage.data ? JSON.parse(ticketMessage.data) : {};
    console.log(message, attachment);
    if (message) {
        ticketData = {
            ...ticketData,
            text: message,
        }
    }

    if (attachment) {
        ticketData = {
            ...ticketData,
            attachment: attachment
        }
    }

    ticketMessage.data = JSON.stringify(ticketData);
    await ticketMessage.save();
};