import {
    BUTTON_LISTS_TEXT,
    CUSTOMER_MESSAGE_CALLBACK,
    LONG_RESPONSE_CALLBACK,
    LONG_RESPONSE_CALLBACK_TIME_OUT, PLATFORM_FB, PLATFORM_IG
} from "../appConst";
import {delayTimeout, viToSlug} from "../appHelper";
import {sendWithMessage} from "./FbService";
import db from "../models";
import {sendIgWithMessage} from "./IgService";

/**
 *
 * @param ticket
 * @param customer
 * @param text
 * @param isStandBy
 * @param platform
 * @returns {Promise<void>}
 */
export const processAutoAnswer = async (ticket, customer, text, isStandBy = false, platform = PLATFORM_FB) => {
    console.log("processAutoAnswer");
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
                        console.log("FacebookHandler.doAutoInbox");
                        await doAutoInbox(answerManagers[i], ticket, customer, isStandBy);
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
        console.log("FacebookHandler.defaultMessageResponse");
        await defaultMessageResponse(platform, customer.platformId, isStandBy);
    } else {
        console.log("FacebookHandler.sendAskToClose");
        // ticket.case_status = TICKET_CASE_STATUS_DONE;
        // await ticket.save();
        // TODO Ask user to close ticket or wait 24h to close it, quick reply
    }
};

export const doAutoInbox = async (aws, ticket, customer, isStandBy = false) => {
    let contain = aws.content;
    if (contain.length > 0) {
        let script = db.BotScript.build({
            type: BUTTON_LISTS_TEXT,
            // quick_replies: [];
            buttons: [],
            unique_id: CUSTOMER_MESSAGE_CALLBACK,
            title: contain,
            parent: null,
        });

        await sendWithMessage(customer.platformId, script, "", isStandBy);
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


export const defaultMessageResponse = async (platform, psid, script_call_back = LONG_RESPONSE_CALLBACK, isStandBy) => {
    await delayTimeout(LONG_RESPONSE_CALLBACK_TIME_OUT);
    const script = await db.BotScript.findOne({
        where: {
            unique_id: script_call_back
        }
    });
    if (!script) {
        throw new Error(`Script not found: ${script_call_back}`);
    }

    switch (platform) {
        case PLATFORM_FB:
            await sendWithMessage(psid, script, "", isStandBy);
            break;
        case PLATFORM_IG:
            await sendIgWithMessage(psid, script, "", isStandBy);
            break;
        default:
            throw new Error(`Not support platform ${platform}`);
    }
};