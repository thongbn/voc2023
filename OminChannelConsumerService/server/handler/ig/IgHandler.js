import {
    IG_MESSAGE,
    IG_POSTBACK,
    PLATFORM_IG,
} from "../../appConst";
import {createRawData} from "../../services/RawService";
import FBBaseHandler from "../FBBaseHandler";
import {
    handlePostback,
    handleQuickReplyMessage,
    handleReaction,
    handleRead,
    handleTextAndAttachmentMessage
} from "./IgMessageHandler";
import {handleChangeItem} from "./IgChangesHandler";

export default class IgHandler extends FBBaseHandler {
    constructor() {
        super(process.env.KAFKA_TOPIC_INSTAGRAM, PLATFORM_IG);
    }

    async handleItem(item) {
        const {id, time, messaging, standby, changes} = item;
        //TODO hop_context
        if (standby) {
            await this.handleStandByArray(id, time, standby);
        } else if (messaging) {
            await this.handleMessagingArray(id, time, messaging);
        } else if (changes) {
            await this.handleChangesArray(id, time, changes);
        } else {
            console.error("Item not supported");
        }
    };

    /**
     * @param {string} id
     * @param {number} time
     * @param {[any]} changes
     * */
    async handleChangesArray(id, time, changes) {
        try {
            for (const item of changes) {
                await handleChangeItem(id, time, item);
            }
        } catch (e) {
            console.error(e);
            //TODO Handle exception here
        }
    };

    async handleMessage(id, time, messaging, isStandBy = false) {
        try {
            const {message, reaction, postback, read} = messaging;

            //Truong hop reaction
            if (reaction) {
                await handleReaction(messaging);
            }

            //Truong hop message type postback
            if (postback) {
                const rawMessage = await createRawData(this.platform, id, time, IG_POSTBACK, JSON.stringify(messaging));
                try {
                    await handlePostback(id, messaging, rawMessage, isStandBy);
                } catch (e) {
                    rawMessage.isError = true;
                    rawMessage.errorMessage = e.message;
                    rawMessage.save();
                } finally {
                }
            }

            //Truong hop messagin seen
            if (read) {
                await handleRead(messaging);
            }

            //Truong hop xu ly message binh thuong
            if (message) {
                const {quick_reply} = message;
                let rawMessage = await createRawData(this.platform, id, time, IG_MESSAGE, JSON.stringify(messaging));
                try {
                    if (!quick_reply) {
                        await handleTextAndAttachmentMessage(id, messaging, rawMessage, isStandBy);
                    } else {
                        await handleQuickReplyMessage(id, messaging, rawMessage, isStandBy);
                    }
                } catch (e) {
                    rawMessage.isError = true;
                    rawMessage.errorMessage = e.message;
                    rawMessage.save();
                } finally {
                }
            }
            //TODO xu ly truong hop referrer neu can
        } catch (e) {
            throw e;
        }
    };
}