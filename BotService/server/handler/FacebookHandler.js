import {MESSAGE_TYPE_TEXT_ATTACHMENTS, PLATFORM_FB, TICKET_CASE_STATUS_DONE, TICKET_TYPE_MESSAGE} from "../appConst";
import {processAutoAnswer} from "../services/AutoAnswerService";
import {getCustomerById} from "../services/CustomerService";
import {findTicketById} from "../services/TicketService";
import {findMessageById} from "../services/MessageService";
import BaseFacebookHandler from "./BaseFacebookHandler";
import db from "../models";
import {sendWithMessage} from "../services/FbService";

export default class FacebookHandler extends BaseFacebookHandler {
    constructor() {
        super(process.env.KAFKA_FB_BOT_TOPIC, PLATFORM_FB);
    }

    async doAutoAnswer(ticket, customer, text, isStandBy) {
        await processAutoAnswer(ticket, customer, text, isStandBy);
    }

    async doPostback(ticket, customer, payload, isStandBy) {
        const script = await db.BotScript.findOne({
            where: {
                unique_id: payload
            }
        });

        if (!script) {
            throw new Error(`Script not found: ${payload}`);
        }

        await sendWithMessage(customer.platformId, script, "", isStandBy);
    }
}