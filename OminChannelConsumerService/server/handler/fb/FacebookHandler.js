import {createRawData} from "../../services/RawService";
import {FB_MESSAGE, FB_POSTBACK, PLATFORM_FB} from "../../appConst";
import FBBaseHandler from "../FBBaseHandler";
import {handlePostback, handleReaction, handleRead, handleTextAndAttachmentMessage} from "./FbMessageHandler";
import {handleCommentArray} from "./FbCommentHandler";

export default class FacebookHandler extends FBBaseHandler {
    constructor() {
        super(process.env.KAFKA_TOPIC_FB, PLATFORM_FB);
    }

    async handleItem(item) {
        const {id, time, messaging, standby, changes} = item;
        //TODO hop_context
        if (standby) {
            await this.handleStandByArray(id, time, standby);
        }if (messaging) {
            await this.handleMessagingArray(id, time, messaging);
        } else if (changes) {
            await handleCommentArray(id, time, changes);
        } else {
            console.error("Item not supported");
        }
    }

    /**
     *
     * @param  {string} id
     * @param {number} time
     * @param {any} messaging
     * @param {boolean} isStandBy
     */
    async handleMessage(id, time, messaging, isStandBy) {
        try {
            const {message, postback, reaction, read} = messaging;

            //Truong hop reaction
            if (reaction) {
                await handleReaction(messaging);
            }

            //Truong hop messagin seen
            if (read) {
                await handleRead(messaging);
            }

            //Truong hop message type postback
            if (postback) {
                const rawMessage = await createRawData(this.platform, id, time, FB_POSTBACK, JSON.stringify(messaging));
                try {
                    await handlePostback(id, messaging, rawMessage, isStandBy);
                } catch (e) {
                    rawMessage.isError = true;
                    rawMessage.errorMessage = e.message;
                    rawMessage.save();
                } finally {
                }
            }

            //Truong hop xu ly message binh thuong
            if (message) {
                let rawMessage = await createRawData(this.platform, id, time, FB_MESSAGE, JSON.stringify(messaging));
                try {
                    await handleTextAndAttachmentMessage(id, messaging, rawMessage, isStandBy);
                    // rawMessage.messageId = message?.id;
                } catch (e) {
                    rawMessage.isError = true;
                    rawMessage.errorMessage = e.message;
                    rawMessage.save();
                } finally {
                }
            }
        } catch (e) {
            throw e;
        }
    }
}