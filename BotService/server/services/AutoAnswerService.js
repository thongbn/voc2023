/**
 * 
 * @param {db.Ticket} ticket 
 * @param {string} text 
 * @param {Promise<any>} fallBack 
 */
export const processAutoAnswer = async (ticket, text, fallBack = null) => {
    const answerManagers = await findAllAnswerManagers();
    let compareMess = Helper.viToSlug(text);
    let canBreak = false;
    for (let i = 0; i < answerManagers.length; i++) {
        // if(answerManagers[i].id == 3){
        //     console.log("Check CGV", answerManagers[i].max_words, compareMess.split(" ").length);
        // }
        // console.log("Check max words");
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
                        fallBack;
                        break;
                    }
                }
            }

            if (canBreak) {
                break;
            }
        }

        if (!canBreak) {
            // InboxHandler.getResQueue(data, conv);

        } else {
            ticket.case_status = TICKET_CASE_STATUS_DONE;
            ticket.save();
        }
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

export const fbDoAutoImport = async (answerManager, ticket) => {
    const { content } = answerManager;
    if (!content || content.length === 0) {
        throw new Error(`Content is null or empty`, answerManager.id);
    }
}