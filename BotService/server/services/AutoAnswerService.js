import { BUTTON_LISTS_TEXT, CUSTOMER_MESSAGE_CALLBACK, LONG_RESPONSE_CALLBACK, LONG_RESPONSE_CALLBACK_TIME_OUT } from "../appConst";
import { delayTimeout } from "../appHelper";
import { sendWithMessage } from "./FbService";

/**
 * 
 * @param {db.Ticket} ticket 
 * @param {string} text 
 * @param {Promise<any>} fallBack 
 */
export const processAutoAnswer = async (ticket, customer, text) => {
    const answerManagers = await findAllAnswerManagers();
    let compareMess = Helper.viToSlug(text);
    let canBreak = false;
    for (let i = 0; i < answerManagers.length; i++) {
        if (compareMess.split(" ").length <= answerManagers[i].max_words) {
            let keywords = answerManagers[i].answerKeywords;
            let exclude_keywords = [];
            let include_keywords = [];
            let canAnswer = true;
            for (let j = 0; j < keywords.length; j++) {
                if (keywords[j].is_exclude === 1) {
                    exclude_keywords.push(keywords[j]);
                } else {
                    include_keywords.push(keywords[j]);
                }
            }

            for (let j = 0; j < exclude_keywords.length; j++) {
                if (compareMess.indexOf(exclude_keywords[j].keyword) !== -1) {
                    canAnswer = false;
                    break;
                }
            }

            if (canAnswer) {
                for (let j = 0; j < include_keywords.length; j++) {
                    if (compareMess.indexOf(include_keywords[j].keyword) !== -1) {
                        console.log("Facebook Handler.doAutoInbox");
                        canBreak = true;
                        break;
                    }
                }
            }

            if (canBreak) {
                break;
            }
        }
    }

    if (!canBreak) {
        // InboxHandler.getResQueue(data, conv);
        //TODO Response default message
        await defaultMessageResponse(customer.platformId);
    } else {
        // ticket.case_status = TICKET_CASE_STATUS_DONE;
        // await ticket.save();
        // TODO Ask user to close ticket or wait 24h to close it, quick reply
    }
}

export const doAutoInbox = async (aws, ticket) => {
    let contain = anw.content;
    if (contain.length > 0) {
        let script = db.BotScript.build({
            type: BUTTON_LISTS_TEXT,
            // quick_replies: [];
            buttons: [],
            unique_id: CUSTOMER_MESSAGE_CALLBACK,
            title: contain,
            parent: null,
        });

        await sendWithMessage(conv.psid, script);
    }
}

export const findAllAnswerManagers = async () => {
    return await AnswerManager.findAll({
        where: {
            active: "active"
        },
        include: ['answerKeywords'],
        attributes: [
            'id', 'sort_order', 'active', 'max_words', 'content'
        ],
        order: [
            ['sort_order', 'DESC'],
        ]
    });
}


export const defaultMessageResponse = async (psid, script_call_back = LONG_RESPONSE_CALLBACK) => {
    await delayTimeout(LONG_RESPONSE_CALLBACK_TIME_OUT);
    const script = await db.BotScript.findOne({
        where: {
            unique_id: script_call_back
        }
    });
    if (!script) {
        throw new Error("Script not found:", script_call_back);
    }
    await sendWithMessage(psid, script);
}