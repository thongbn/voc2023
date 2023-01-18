import {BaseController} from "../BaseController";
import LoginSchema from "../../validation/LoginSchema";
import RenewTokenSchema from "../../validation/RenewTokenSchema";
import RegisterSchema from "../../validation/RegisterSchema";
import createError from 'http-errors';
import {errorHttp, genJwt, genRefreshTokenKey, randomString} from "../../helper/util";
import {redisClient} from "../../database/RedisClient";
import bcrypt from 'bcryptjs';
import AuthenticateMiddleware from "../../middleware/AuthenticateMiddleware";
import AuthorizationMiddleware from "../../middleware/AuthorizationMiddleware";
import db from "../../models";
import queryStringConverter from "sequelize-querystring-converter";
import {paginationDataResult, paginationQuery} from "../../helper/queryHelper";

export default class TicketController extends BaseController {
    constructor() {
        super("/tickets");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/', this.index.bind(this));
    }

    async detail(req, res, next) {

    }

    async changeCaseStatus(req, res, next) {

    }

    async getTags(req, res, next) {

    }

    async addTags(req, res, next) {

    }

    async getNotes(req, res, next) {

    }

    async addNotes(req, res, next) {

    }

    async replyTicket(req, res, next) {

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