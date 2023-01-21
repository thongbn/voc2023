import {BaseController} from "../BaseController";
import createError from 'http-errors';
import db from "../../models";
import queryStringConverter from "sequelize-querystring-converter";
import {paginationDataResult, paginationQuery} from "../../helper/queryHelper";
import {getTicketById} from "../../services/TicketService";
import {getTagById, getTagModel, getTagsByModelId} from "../../services/TagService";
import {CASE_STATUS_DONE, CASE_STATUS_PROCESS} from "../../helper/appConst";

export default class TicketController extends BaseController {
    constructor() {
        super("/tickets");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/', this.index.bind(this));

        //Note function
        this.getRouter().post('/:id/note', this.addNote.bind(this));
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
            const model = await getTicketById(id, ["messages"]);
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

    async replyTicket(req, res, next) {
        try {

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
            console.log(criteria);
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