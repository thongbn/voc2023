import BaseHandler from "./BaseHandler";

export default class FBBaseHandler extends BaseHandler{
    handle(message) {
        try {
            const messageString = message.value.toString();
            //Save raw message
            const data = JSON.parse(messageString);
            const {entry} = data;
            entry.forEach(item => {
                this.handleItem(item);
            });
        } catch (e) {
            throw e;
        }
    };

    handleItem(item){
        console.log("Un-implements handleItem");
    }

    /**
     * @param {string} id
     * @param {number} time
     * @param {[any]} messaging
     * */
    handleMessagingArray(id, time, messaging) {
        try {
            messaging.forEach(item => {
                this.handleMessage(id, time, item)
                    .catch(e => {
                        console.error(e);
                    });
            })
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
     */
    async handleMessage(id, time, message) {
        console.log("Un-implements handleMessage");
    }
}