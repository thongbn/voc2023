import {BaseController} from "../BaseController";
import ZaloVerifySchema from "../../validation/ZaloVerifySchema";
import crypto from 'crypto';
import {validationResult} from "express-validator";
import createError from "http-errors";
import kafkaClient from "../../database/KaffkaClient";

export default class ZaloHookController extends BaseController {
    constructor() {
        super("/zalo");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().post('/'
            //TODO FIX ME
            // , ZaloVerifySchema()
            , this.verify.bind(this));
    }

    async verify(req, res, next) {
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new createError(403, "Lỗi dữ liệu", {
                    ...errors
                }));
            }

            kafkaClient
                .sendZalo(req.body)
                .catch(e => {
                    console.error(e);
                });
            return res.json({
                success: true
            });
        }catch (e) {
            next(e);
        }
    }
}