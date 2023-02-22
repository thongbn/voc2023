import {
    PLATFORM_IG,
} from "../appConst";
import {processAutoAnswer} from "../services/AutoAnswerService";
import db from "../models";
import BaseFacebookHandler from "./BaseFacebookHandler";
import {sendIgWithMessage} from "../services/IgService";

export default class IgHandler extends BaseFacebookHandler {
    constructor() {
        super(process.env.KAFKA_IG_BOT_TOPIC, PLATFORM_IG);
    }

    async doAutoAnswer(ticket, customer, text, isStandBy) {
        await processAutoAnswer(ticket, customer, text, isStandBy, PLATFORM_IG);
    }

    async doPostback(ticket, customer, payload, isStandBy) {
        if (!payload) {
            throw new Error(`Payload empty`);
        }

        const script = await db.BotScript.findOne({
            where: {
                unique_id: payload
            }
        });

        if (!script) {
            throw new Error(`Script not found: ${payload}`);
        }

        await sendIgWithMessage(customer.platformId, script, "", isStandBy);
    }

}