import { MESSAGE_TYPE_TEXT_ATTACHMENTS, TICKET_CASE_STATUS_DONE, TICKET_TYPE_MESSAGE } from "../appConst";
import { processAutoAnswer } from "../services/AutoAnswerService";
import { getCustomerById } from "../services/CustomerService";
import { findTicketById } from "../services/TicketService";
import BotHandler from "./BotHandler"

export default class FacebookHandler extends BotHandler {
    /**
    *
    * @param {any}messageData
    */
    async handleMessage(messageData) {
        const { ticketId, messageId } = messageData;
        if (!ticketId || !messageId) {
            throw new Error("Ticket id, message id  missing");
        }

        const p1 = findTicketById(ticketId);
        const p2 = findTicketById(messageId);

        const [ticket, message] = await Promise.all([p1, p2]);

        if (!ticket || !message) {
            throw new Error("Ticket, or message not founded", ticketId, messageId);
        }

        if (ticket.caseStatus === TICKET_CASE_STATUS_DONE) {
            return;
        }

        if (ticket.type !== TICKET_TYPE_MESSAGE) {
            throw new Error(`Ticket type not support:`, ticket.type);
        }

        switch (message.type) {
            case MESSAGE_TYPE_TEXT_ATTACHMENTS:
                await this.handleTextAndMessage(ticket, message);
                break;
            default:
                throw new Error("Message not supported");
        }
    }

    async handleTextAndMessage(ticket, message) {
        const { data } = message;
        const { text } = data;
        if (!text) {
            return;
        }

        const customer = getCustomerById(ticket.customerId);
        if (!customer) {
            throw new Error(`Ticket customer not found`, ticket.id, ticket.customerId);
        }

        await processAutoAnswer(ticket, customer, text, async (answerManager) => {

        });

        //If no key word reply default if no queue waiting before
    }
}