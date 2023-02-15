import {
    PLATFORM_IG,
} from "../appConst";
import {processAutoAnswer} from "../services/AutoAnswerService";
import BotHandler from "./BotHandler"

export default class IgHandler extends BotHandler {
    constructor() {
        super(process.env.KAFKA_IG_BOT_TOPIC, PLATFORM_IG);
    }

    async doAutoAnswer(ticket, customer, text, isStandBy) {
        await processAutoAnswer(ticket, customer, text, isStandBy);
    }
}