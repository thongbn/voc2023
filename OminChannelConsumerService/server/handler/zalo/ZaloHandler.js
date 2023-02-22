import BaseHandler from "../BaseHandler";
import {PLATFORM_ZL} from "../../appConst";

export default class ZaloHandler extends BaseHandler {
    constructor() {
        super(process.env.KAFKA_TOPIC_ZALO, PLATFORM_ZL);
    }

    async handle(message) {
        try {
            const messageString = message.value.toString();
            //Save raw message
            const data = JSON.parse(messageString);
        } catch (e) {
            throw e
        }
    };


}