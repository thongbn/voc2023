import {BaseController} from "../BaseController";
import db from "../../models";
import queryStringConverter from "sequelize-querystring-converter";
import {paginationDataResult, paginationQuery} from "../../helper/queryHelper";
import {Op} from "sequelize";

export default class TagController extends BaseController {
    constructor() {
        super("/tags");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/', this.index.bind(this));
        this.getRouter().get('/all', this.getAllWithCategory.bind(this));
    }

    async getAllWithCategory(req, res, next) {
        try {
            const models = await db.TagCategory.findAll({
                where: {
                    active: {
                        [Op.ne]: "deactivated"
                    }
                },
                attributes: ['id', 'name', 'sort_order'],
                include: [
                    {
                        model: db.TagVoc,
                        attributes: [
                            "id", 'tag_name', "color", "active"
                        ],
                        as: "tags"
                    }
                ]
            });
            return res.json({
                data: models,
            })
        } catch (e) {
            next(e);
        }
    }

    async index(req, res, next) {
        try {
            // const {query} = req;
            // const queryObj = queryStringConverter.convert({
            //     query: {
            //         ...query,
            //     },
            //     basedProperties: [
            //         'platform',
            //         'id',
            //         'caseStatus',
            //         'customerId',
            //         'type',
            //         'createdAt',
            //         'tags'
            //     ]
            // });
            // const criteria = paginationQuery(queryObj, req);
            // const models = await db.Ticket.findAll({
            //     ...criteria,
            //     include: [
            //         {
            //             model: db.Customer,
            //             attributes: ["id", 'fullname', "avatar", "phone", "email"],
            //             as: "customer"
            //         }
            //     ]
            // });
            // return res.json(paginationDataResult(models, req));
        } catch (e) {
            next(e);
        }
    }
}