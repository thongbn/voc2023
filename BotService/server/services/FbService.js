import { graphPostRequest } from "./GraphApiService";

/**
 * 
 * @param {string} userId 
 * @param {db.BotScript} message 
 * @param {string} params 
 * @returns 
 */
export const sendWithMessage = async (userId, message, params = "") => {

    let messageRes = {};

    console.log(userId, message.type, message.unique_id, message.title);

    if (message.type === ButtonListType.QUICK_REPLIES) {
        // let quickBtns = [];
        // message.quick_replies.map(function (val) {
        //     let btn = {
        //         content_type: "text",
        //         title: val.title,
        //         payload: val.payload,
        //         image_url: val.image_url,
        //     };
        //     quickBtns.push(btn);
        // });
        // messageRes = {
        //     ...messageRes,
        //     ...{
        //         text: message.title,
        //         quick_replies: quickBtns
        //     }
        // }
    } else if (message.type == ButtonListType.BUTTONS) {
        let buttons = await MessageHelper.createButtons(message, params);
        // if (message.parent) {
        //     let btn = {
        //         type: ButtonModelType.POST_BACK,
        //         title: "Quay lại",
        //         payload: message.parent
        //     };
        //     buttons.push(btn);
        // }
        messageRes = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: message.title,
                    buttons: buttons
                }
            }
        }
    } else {
        console.log("Text messenger prepare");
        messageRes = {
            text: message.title,
        }
    }

    console.log("Message Res: ", messageRes);


    const res = await graphPostRequest("", {
        recipient: {
            id: userId
        },
        message: messageRes
    });

    return await res.data;
}

/**
 * 
 * @param {string} userId 
 * @param {string} text 
 * @param {any} options 
 * @param {any} callbacks 
 * @returns 
 */
export const sendTextMessage = async (userId, text, options = {}) => {
    console.log(userId, text);
    const res = await graphPostRequest("", {
        recipient: {
            id: userId
        },
        message: {
            text: text,
            ...options
        }
    });

    return await res.data;
}