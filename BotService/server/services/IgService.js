import {graphPostRequest} from "./GraphApiService";
import {
    BUTTON_LISTS_BUTTONS,
    BUTTON_LISTS_QUICK_REPLIES,
    BUTTON_MODE_TYPE_PHONE_NUMBER, BUTTON_MODE_TYPE_POST_BACK,
    BUTTON_MODE_TYPE_WEB_URL
} from "../appConst";
import db from "../models";
import {isAbsoluteUrl} from "../appHelper";

/**
 *
 * @param {string} userId
 * @param {db.BotScript} message
 * @param {string} params
 * @param {boolean} isStandBy
 * @returns
 */
export const sendIgWithMessage = async (userId, message, params = "", isStandBy = false) => {

    let messageRes = {};

    console.log("sendIgWithMessage: ", userId, message.type, message.unique_id, message.title);

    if (message.type === BUTTON_LISTS_QUICK_REPLIES) {
        let quickBtns = [];
        message.quick_replies.map(function (val) {
            let btn = {
                content_type: "text",
                title: val.title,
                payload: val.payload,
                image_url: val.image_url,
            };
            quickBtns.push(btn);
        });
        messageRes = {
            text: message.title,
            quick_replies: quickBtns
        }
    } else if (message.type === BUTTON_LISTS_BUTTONS) {
        let {buttons, urls} = await createIgButtons(message, params);
        // if (message.parent) {
        //     let btn = {
        //         type: ButtonModelType.POST_BACK,
        //         title: "Quay lại",
        //         payload: message.parent
        //     };
        //     buttons.push(btn);
        // }
        messageRes = {
            text: `Vui lòng chọn hỗ trợ dưới đây\n${urls.map(u => `- ${u.title}: ${u.url}`).join("\n")}`,
        };

        if(buttons.length > 0){
            messageRes = {
                ...messageRes,
                quick_replies: buttons
            }
        }
    } else {
        messageRes = {
            text: message.title,
        }
    }

    console.log("Message body: ", JSON.stringify(messageRes));
    if (isStandBy) {
        await graphPostRequest("/me/take_thread_control", {
            recipient: {
                id: userId
            }
        });
    }

    const res = await graphPostRequest("/me/messages", {
        recipient: {
            id: userId
        },
        message: messageRes
    });

    if (isStandBy) {
        await graphPostRequest("/me/release_thread_control", {
            recipient: {
                id: userId
            }
        });
    }
    console.log("SendWithMessage result: " + JSON.stringify(res));
    return res;
};

/**
 *
 * @param {string} userId
 * @param {string} text
 * @param {any} options
 * @returns
 */
export const sendIgTextMessage = async (userId, text, options = {}) => {
    console.log(userId, text);
    const res = await graphPostRequest("/me/messages", {
        recipient: {
            id: userId
        },
        message: {
            text: text,
            ...options
        }
    });

    return await res.data;
};

//Change to quick reply in ig
export const createIgButtons = async (message, params) => {
    let buttons = [];
    let urls = [];
    let scriptBtns = await db.ScriptButtons.findAll({
        where: {
            'bot_script_id': message.id
        },
        // logging: console.log,
        order: [
            ['id', 'DESC']
        ]
    });
    let scriptBtnIds = [];
    scriptBtns.map((item) => {
        scriptBtnIds.push(item.button_id);
    });

    let botScriptButtons = await db.BotScriptButton.findAll({
        where: {
            'id': scriptBtnIds
        },
    });

    botScriptButtons.map((val, idx) => {
        let tempParam = params;
        if (val.type === BUTTON_MODE_TYPE_WEB_URL) {
            let splitted = val.payload.split("#");
            let url = splitted[0];
            if (!isAbsoluteUrl(url)) {
                url = process.env.BOT_WEB_BASE_URL + url;
            }

            let hashHeading = "";
            if (splitted.length > 1) {
                hashHeading = "#" + splitted[1];
            }

            // tempParam += (val.callback ? "&callback=" + val.callback : "")
            //     + (val.url_param ? "&" + val.url_param : "");


            let myurl = {
                url: url,
                title: val.title,
            };

            urls.push(myurl);
        } else if (val.type === BUTTON_MODE_TYPE_PHONE_NUMBER) {
            let btn = {
                url: val.payload,
                title: val.title
            };
            urls.push(btn);
        } else if (val.type === BUTTON_MODE_TYPE_POST_BACK) {
            let btn = {
                content_type: "text",
                title: val.title,
                payload: val.payload,
            };
            buttons.push(btn);
        }
    });
    return {
        buttons,
        urls,
    };
};