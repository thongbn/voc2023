import { BUTTON_LISTS_TEXT, CUSTOMER_MESSAGE_CALLBACK, LONG_RESPONSE_CALLBACK, LONG_RESPONSE_CALLBACK_TIME_OUT } from "../appConst";
import {delayTimeout, viToSlug} from "../appHelper";
import { sendWithMessage } from "./FbService";
import db from "../models";

/**
 *
 * @param ticket
 * @param customer
 * @param text
 * @returns {Promise<void>}
 */
export const processAutoAnswer = async (ticket, customer, text) => {
    const answerManagers = await findAllAnswerManagers();
    let compareMess = viToSlug(text);
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
                        await doAutoInbox(answerManagers[i], ticket, customer);
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
        await defaultMessageResponse(customer.platformId);
    } else {
        // ticket.case_status = TICKET_CASE_STATUS_DONE;
        // await ticket.save();
        // TODO Ask user to close ticket or wait 24h to close it, quick reply
    }
};

export const doAutoInbox = async (aws, ticket, customer) => {
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

        await sendWithMessage(customer.platformId, script);
    }
};

export const findAllAnswerManagers = async () => {
    return await db.AnswerManager.findAll({
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
};


export const defaultMessageResponse = async (psid, script_call_back = LONG_RESPONSE_CALLBACK) => {
    await delayTimeout(LONG_RESPONSE_CALLBACK_TIME_OUT);
    const script = await db.BotScript.findOne({
        where: {
            unique_id: script_call_back
        }
    });
    if (!script) {
        throw new Error(`Script not found: ${script_call_back}`);
    }
    await sendWithMessage(psid, script);
};