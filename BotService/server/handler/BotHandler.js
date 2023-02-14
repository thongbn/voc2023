import BaseHandler from "./BaseHandler";

export default class BotHandler extends BaseHandler {
    handle(message) {
        try {
            const messageString = message.value.toString();
            //Save raw message
            const data = JSON.parse(messageString);
            this.handleMessage(data);
        } catch (e) {
            throw e;
        }
    };

    /**
     *
     * @param {any}message
     */
    async handleMessage(messageData) {
        console.log("Un-implements handleMessage");
    }
}