import BaseHandler from "./BaseHandler";

export default class BotHandler extends BaseHandler {
    async handle(message) {
        try {
            const messageString = message.value.toString();
            //Save raw message
            const data = JSON.parse(messageString);
            await this.handleMessage(data);
        } catch (e) {
            throw e;
        }
    };

    /**
     *
     * @param {any}messageData
     */
    async handleMessage(messageData) {
        console.log("Un-implements handleMessage");
    }
}