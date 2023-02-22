import {
    MESSAGE_TYPE_POSTBACK,
    MESSAGE_TYPE_TEXT_ATTACHMENTS,
    PLATFORM_FB,
    TICKET_CASE_STATUS_DONE,
    TICKET_TYPE_MESSAGE
} from "../appConst";
import {processAutoAnswer} from "../services/AutoAnswerService";
import {getCustomerById} from "../services/CustomerService";
import {findTicketById} from "../services/TicketService";
import BotHandler from "./BotHandler"
import {findMessageById} from "../services/MessageService";

export default class BaseFacebookHandler extends BotHandler {
    constructor(topic, platform) {
        super(topic, platform);
    }

    /**
     *
     * @param {any}messageData
     */
    async handleMessage(messageData) {
        const {ticketId, messageId, isStandBy = false} = messageData;
        if (!ticketId || !messageId) {
            throw new Error("Ticket id, message id  missing");
        }

        const p1 = findTicketById(ticketId);
        const p2 = findMessageById(messageId);

        const [ticket, message] = await Promise.all([p1, p2]);

        if (!ticket || !message) {
            throw new Error(`Ticket, or message not founded: ${ticketId}, ${messageId}`);
        }

        console.log("Ticket case status", ticket.caseStatus);
        if (ticket.caseStatus === TICKET_CASE_STATUS_DONE) {
            throw new Error(`Ticket set done: do nothing: ${ticket.caseStatus}`);
        }

        if (ticket.type !== TICKET_TYPE_MESSAGE) {
            throw new Error(`Ticket type not support: ${ticket.type}`);
        }

        console.log("Message type", message.type);
        switch (message.type) {
            case MESSAGE_TYPE_TEXT_ATTACHMENTS:
                await this.handleTextAndMessage(ticket, message, isStandBy);
                break;
            case MESSAGE_TYPE_POSTBACK:
                await this.handlePostBack(ticket, message, isStandBy);
                break;
            default:
                console.log("Message not supported");
        }
    }

    async handlePostBack(ticket, message, isStandBy) {
        console.log("handlePostBack", message.data);
        const {data} = message;
        const {payload} = JSON.parse(data);

        if(!payload){
            throw new Error(`Payload is null: ${data}`);
        }

        const customer = await getCustomerById(ticket.customerId);
        if (!customer) {
            throw new Error(`Ticket customer not found ${ticket.id}, ${ticket.customerId}`);
        }

        await this.doPostback(ticket, customer, payload, isStandBy);
    }

    async handleTextAndMessage(ticket, message, isStandBy = false) {
        console.log("handleTextAndMessage", message.data);
        const {data} = message;
        const {text, quickReply} = JSON.parse(data);
        if (!text) {
            console.log("text is empty", JSON.parse(data));
            return;
        }

        const customer = await getCustomerById(ticket.customerId);
        if (!customer) {
            throw new Error(`Ticket customer not found ${ticket.id}, ${ticket.customerId}`);
        }

        if(!quickReply){
            await this.doAutoAnswer(ticket, customer, text, isStandBy);
        }else{
            await this.doPostback(ticket, customer, quickReply.payload, isStandBy);
        }
    }

    async doAutoAnswer(ticket, customer, text, isStandBy) {
        //Implement
    }

    async doPostback(ticket, customer, payload, isStandBy){
        //Implement
    }
}