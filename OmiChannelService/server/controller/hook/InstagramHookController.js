import {BaseController} from "../BaseController";
import FacebookVerifySchema from "../../validation/facebook/FacebookVerifySchema";
import FacebookVerifyHookData from "../../validation/facebook/FacebookVerifyHookData";
import {validationResult} from "express-validator";
import createError from "http-errors";
import {getFacebookSettings} from "../../services/ConfigService";
import kafkaClient from "../../database/KaffkaClient";

export default class InstagramHookController extends BaseController {
    constructor() {
        super("/instagram");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/', FacebookVerifySchema(), this.index.bind(this));
        this.getRouter().post('/'
            , FacebookVerifyHookData()
            , this.receiveHookData.bind(this));
    }

    async index(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new createError(403, "Lỗi dữ liệu", {
                    ...errors
                }));
            }
            console.log(req.query);
            //check verify token
            if (req.query['hub.mode'] !== "subscribe") {
                throw new createError(403, "Lỗi verify (1)");
            }

            const fbSettings = await getFacebookSettings();

            if (req.query['hub.verify_token'] !== fbSettings.verifyToken) {
                throw new createError(403, "Lỗi verify (2)");
            }

            return res.status(200).send(req.query['hub.challenge']);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    async receiveHookData(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new createError(400, "Lỗi dữ liệu", {
                    ...errors
                }));
            }
            //Publish body to kafka
            kafkaClient
                .sendInstagram(req.body)
                .catch(e => {
                    console.error(e);
                });
            return res.json({
                success: true
            });
        } catch (e) {
            console.error(e);
            next(e);
        }
    }
}