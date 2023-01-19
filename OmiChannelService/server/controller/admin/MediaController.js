import {BaseController} from "../BaseController";
import db from "../../models";
import queryStringConverter from "sequelize-querystring-converter";
import {paginationDataResult, paginationQuery} from "../../helper/queryHelper";

export default class MediaController extends BaseController {
    constructor() {
        super("/media");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/', this.index.bind(this));
    }

    async upload(req, res, next) {

    }

    async delete(req, res, next) {

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