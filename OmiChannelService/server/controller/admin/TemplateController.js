import {BaseController} from "../BaseController";
import db from "../../models";
import queryStringConverter from "sequelize-querystring-converter";
import {paginationDataResult, paginationQuery} from "../../helper/queryHelper";
import {Op} from "sequelize";

export default class TemplateController extends BaseController {
    constructor() {
        super("/templates");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/', this.index.bind(this));
    }


    async index(req, res, next) {
        try {
            const {query} = req;
            let queryObj = queryStringConverter.convert({
                query: {
                    ...query,
                },
                basedProperties: [
                    'id',
                    'title',
                    'content'
                ]
            });

            if (query.s) {
                queryObj = {
                    where: {
                        [Op.or]: [
                            {
                                id: query.s
                            },
                            {
                                title: {
                                    [Op.like]: `${query.s}%`
                                }
                            },
                            {
                                content: {
                                    [Op.like]: `%${query.s}%`
                                }
                            }
                        ],
                    },
                    attributes: ['id', 'title', 'content']
                };
            }

            const criteria = paginationQuery(queryObj, req);
            const models = await db.Template.findAll({
                ...criteria
            });
            return res.json(paginationDataResult(models, req));
        } catch (e) {
            next(e);
        }
    }
}