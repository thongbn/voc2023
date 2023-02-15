import BaseHandler from "./BaseHandler";

export default class FBBaseHandler extends BaseHandler{
    async handle(message) {
        try {
            const messageString = message.value.toString();
            //Save raw message
            const data = JSON.parse(messageString);
            const {entry} = data;
            for (const item of entry){
                await this.handleItem(item);
            }
        } catch (e) {
            throw e;
        }
    };

    async handleItem(item){
        console.log("Un-implements handleItem");
    }

    /**
     * @param {string} id
     * @param {number} time
     * @param {[any]} messaging
     * */
    async handleMessagingArray(id, time, messaging) {
        try {
            for (const item of messaging){
                await this.handleMessage(id, time, item, false);
            }
        } catch (e) {
            console.error(e);
            //TODO Handle exception here
        }
    };

    /**
     * @param {string} id
     * @param {number} time
     * @param {[any]} standBy
     * */
    async handleStandByArray(id, time, standBy) {
        try {
            for (const item of standBy){
                await this.handleMessage(id, time, item, true);
            }
        } catch (e) {
            console.error(e);
            //TODO Handle exception here
        }
    };


    /**
     *
     * @param  {string} id
     * @param {number} time
     * @param {any}message
     * @param isStandBy
     */
    async handleMessage(id, time, message, isStandBy = false) {
        console.log("Un-implements handleMessage");
    }
}