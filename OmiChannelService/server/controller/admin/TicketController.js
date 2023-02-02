import {BaseController} from "../BaseController";
import createError from 'http-errors';
import db from "../../models";
import queryStringConverter from "sequelize-querystring-converter";
import {paginationDataResult, paginationQuery} from "../../helper/queryHelper";
import {getTicketById, replayFacebook, replayIg} from "../../services/TicketService";
import {getTagById, getTagModel, getTagsByModelId, getTicketTagsByIds} from "../../services/TagService";
import {
    CASE_STATUS_DONE,
    CASE_STATUS_PROCESS,
    PLATFORM_FB,
    PLATFORM_IG,
    TICKET_CASE_STATUS_PROCESSING
} from "../../helper/appConst";
import {getMessageByTicketId} from "../../services/MessageService";

export default class TicketController extends BaseController {
    constructor() {
        super("/tickets");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/', this.index.bind(this));
        this.getRouter().get('/tags', this.getTagsByTicketIds.bind(this));

        //Note function
        this.getRouter().post('/:id/note', this.addNote.bind(this));
        //Message function
        this.getRouter().get("/:id/messages", this.getMessages.bind(this));
        //Reply function
        this.getRouter().post(`/:id/reply`, this.replyTicket.bind(this));
        //Tag function
        this.getRouter().delete('/:id/tags/:tagId', this.removeTag.bind(this));
        this.getRouter().get('/:id/tags', this.getTags.bind(this));
        this.getRouter().post('/:id/tags', this.addTag.bind(this));
        //Detail
        this.getRouter().post('/:id/set-processing', this.changeProcess.bind(this));
        this.getRouter().post('/:id/set-done', this.changeDone.bind(this));
        this.getRouter().get('/:id', this.detail.bind(this));
    }

    async detail(req, res, next) {
        try {
            const {id} = req.params;
            const model = await getTicketById(id);
            return res.json({
                data: model
            })
        } catch (e) {
            next(e);
        }
    }

    async changeProcess(req, res, next) {
        try {
            const {id} = req.params;
            const model = await getTicketById(id);
            //Check case status
            model.caseStatus = CASE_STATUS_PROCESS;
            await model.save();
            return res.json({
                data: model,
            })
        } catch (e) {
            next(e);
        }
    }

    async changeDone(req, res, next) {
        try {
            const {id} = req.params;
            const {voc, vocEn, note, noteEn} = req.body;

            const model = await getTicketById(id);
            //Set VOC
            model.set({
                caseStatus: CASE_STATUS_DONE,
                vocMessage: voc,
                vocMessageEn: vocEn,
                vocNote: note,
                vocNoteEn: noteEn,
                userClose: req.user.id,
                closedDate: new Date()
            });
            await model.save();

            return res.json({
                data: model,
            })
        } catch (e) {
            next(e);
        }
    }

    async getTags(req, res, next) {
        try {
            const {id} = req.params;
            const model = await getTicketById(id);

            const tags = await getTagsByModelId(
                model.id
                , "Ticket"
                , ['id', 'tag_name', 'color']);

            return res.json({
                data: tags
            })

        } catch (e) {
            next(e);
        }
    }

    async getTagsByTicketIds(req, res, next) {
        try {
            const {ticketIds} = req.query;
            const tags = await getTicketTagsByIds(
                ticketIds.split(",")
                , "Ticket"
                , ['id', 'tag_name', 'color']);

            return res.json({
                data: tags
            })

        } catch (e) {
            next(e);
        }
    }

    async removeTag(req, res, next) {
        try {
            const {id, tagId} = req.params;

            //Find existed Tag
            let tagModel = await getTagModel(tagId, id, "Ticket");
            if (!tagModel) {
                throw createError(404, `Tag id ${tagId} not existed`);
            }
            //
            // await tagModel.delete();
            await db.TagModel.destroy({
                where: {
                    tag_id: tagId,
                    model_id: id,
                    model_type: "Ticket",
                }
            });

            return res.json({
                data: tagModel
            });
        } catch (e) {
            next(e);
        }
    }

    async addTag(req, res, next) {
        try {
            const {id} = req.params;
            const {tagId} = req.body;

            //Check tag available
            const tag = await getTagById(tagId, [
                "id",
                "tag_name",
                "color"
            ]);

            //Find existed Tag
            let tagModel = await getTagModel(tagId, id, "Ticket");
            if (tagModel) {
                throw createError(400, `Tag ${tag.tag_name} existed`);
            }

            const model = await getTicketById(id);

            tagModel = await db.TagModel.build({
                tag_id: tagId,
                model_id: model.id,
                model_type: "Ticket"
            });
            await tagModel.save();

            return res.json({
                data: {
                    tag,
                    tagModel
                }
            });
        } catch (e) {
            next(e);
        }
    }

    async addNote(req, res, next) {
        try {
            const {id} = req.params;
            const {message} = req.body;

            //TODO: get user auth, validate

            const model = await getTicketById(id);

            let notes = JSON.parse(model.userNote);
            if (!notes) {
                notes = [];
            }
            notes.push({
                user: "System",
                message
            });

            model.userNote = JSON.stringify(notes);

            await model.save();

            return res.json({
                data: notes
            });
        } catch (e) {
            next(e);
        }
    }

    async getMessages(req, res, next) {
        const {id} = req.params;
        try {
            const models = await getMessageByTicketId(id, [
                {
                    model: db.Customer,
                    attributes: ["id", 'fullname', "avatar", "phone", "email"],
                    as: "customer"
                }
            ]);
            return res.json({
                data: models
            })
        } catch (e) {
            next(e);
        }
    };

    async replyTicket(req, res, next) {
        try {
            const {id} = req.params;
            console.log(id, req.body);
            const {message, attachments} = req.body;

            if(!message && (!attachments || attachments.length === 0)){
                throw createError(400, `Data can not be null`);
            }

            //Get Ticket
            const model = await getTicketById(id);
            if (!model) {
                throw createError(404, `Ticket ${id} not founded`);
            }

            let replyModel = null;
            switch (model.platform) {
                case PLATFORM_IG: {
                    replyModel = await replayIg(model, {
                        message, attachments
                    });
                    break;
                }
                case PLATFORM_FB: {
                    replyModel = await replayFacebook(model, {
                        message, attachments
                    });
                    break;
                }
                default:
                    throw createError(400, `Platform ${model.platform} not supported`);
            }

            model.caseStatus = TICKET_CASE_STATUS_PROCESSING;
            await model.save();

            return res.json({
                data: {
                    replyModel,
                    ticket: model
                }
            });
        } catch (e) {
            next(e);
        }
    }

    async index(req, res, next) {
        try {
            const {query} = req;
            const queryObj = queryStringConverter.convert({
                query: {
                    ...query,
                },
                basedProperties: [
                    'platform',
                    'id',
                    'caseStatus',
                    'customerId',
                    'type',
                    'createdAt',
                    'tags'
                ]
            });
            const criteria = paginationQuery(queryObj, req);
            const models = await db.Ticket.findAll({
                ...criteria,
                include: [
                    {
                        model: db.Customer,
                        attributes: ["id", 'fullname', "avatar", "phone", "email"],
                        as: "customer"
                    }
                ]
            });
            return res.json(paginationDataResult(models, req));
        } catch (e) {
            next(e);
        }
    }
}