import { MESSAGE_TYPE_RATINGS, MESSAGE_TYPE_TEXT_ATTACHMENTS, TICKET_CASE_STATUS_DONE, TICKET_TYPE_MESSAGE } from "../appConst";
import AnswerManager from "../models/AnswerManager";
import { fbDoAutoImport, findAllAnswerManagers } from "../services/AutoAnswerService";
import { findTicketById } from "../services/TicketService";
import BotHandler from "./BotHandler"

export default class FacebookHandler extends BotHandler {
    /**
    *
    * @param {any}messageData
    */
    async handleMessage(messageData) {
        const { ticketId, messageId } = messageData;
        if (!ticketId || !messageId) {
            throw new Error("Ticket id, message id  missing");
        }

        const p1 = findTicketById(ticketId);
        const p2 = findTicketById(ticketId);

        const [ticket, message] = await Promise.all([p1, p2]);

        if (!ticket || !message) {
            throw new Error("Ticket, or message not founded", ticketId, messageId);
        }

        if (ticket.caseStatus === TICKET_CASE_STATUS_DONE) {
            return;
        }

        if(ticket.type !== TICKET_TYPE_MESSAGE){
            throw new Error(`Ticket type not support:`, ticket.type);
        }

        switch (message.type) {
            case MESSAGE_TYPE_TEXT_ATTACHMENTS:
                await this.handleTextAndMessage(ticket, message);
                break;
            default:
                throw new Error("Message not supported");
        }
    }

    async handleTextAndMessage(ticket, message) {
        const {data} = message;
        const {text} = data;
        if(!text){
            return;
        }
        //Check Key word reply
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
                            await fbDoAutoImport(answerManagers[i], ticket);
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

        //If no key word reply default if no queue waiting before
    }
}