import BeeQueue from "bee-queue";

/**
 * @type {BeeQueue}
 */
let caseFilterQueue;
// let instagramQueue;

export const initQueue = () => {
    caseFilterQueue = new BeeQueue(process.env.CASE_FILTER_QUEUE, {
        redis: {
            host: process.env.REDIS_CONNECTION,
        },
    });

    // instagramQueue = new BeeQueue(process.env.CASE_FILTER_QUEUE, {
    //     redis: {
    //         host: process.env.REDIS_CONNECTION,
    //     },
    // });
}

// export const getCaseFilterQueue = () => {
//     return caseFilterQueue;
// }

export const createCaseFilterQueueJob = ({ type, inboxType = null, data = {}, id = null, time = null }) => {
    try {
        if (process.env.PUBLISH_TO_OLD_CHATBOT === true) {
            caseFilterQueue.createJob({
                type,
                inbox_type: inboxType,
                data,
            }).save();
        }
    } catch (e) {
        console.error(e);
    }
}

// export const getIgQueue = () => {
//     return instagramQueue;
// }