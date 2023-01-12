import {BaseController} from "../BaseController";
import {validationResult} from "express-validator";
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

export default class AuthController extends BaseController {
    constructor() {
        super("/auth");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/', this.index.bind(this));
        this.getRouter().post('/login', LoginSchema(), this.login.bind(this));
        this.getRouter().post('/request-token', RenewTokenSchema(), this.requestToken.bind(this));

        this.getRouter().post('/register'
            // , AuthenticateMiddleware
            // , AuthorizationMiddleware
            , RegisterSchema()
            , this.register.bind(this));
    }

    async index(req, res, next) {
        return res.json({
            path: this.getPath()
        });
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new createError(400, "Lỗi đăng nhập", {
                    ...errors
                });
            }

            const user = await db.User.findOne({
                attributes: ["id", "name", "username", "password"],
                where: {
                    username: req.body.username,
                    isActive: true,
                    // isEmailValidated: true,
                }
            });

            if (!user || !await bcrypt.compare(req.body.password, user.password)) {
                throw new createError(400, "Mật khẩu hoặc email không trùng khớp");
            }

            user.password = undefined;
            const token = genJwt(user);

            const refreshToken = randomString(64);

            //Check old refreshToken
            const rfKey = genRefreshTokenKey(user);
            const oldRf = await redisClient().get(rfKey);
            if (oldRf) {
                await redisClient().del(oldRf);
            }

            await redisClient().hSet(refreshToken, {
                id: user.id,
                username: user.username,
            });
            await redisClient().set(rfKey, refreshToken);

            return res.json({
                token,
                refreshToken,
                user
            });
        } catch (e) {
            next(e);
        }
    }

    async register(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new createError(400, "Lỗi tạo tài khoản", {
                ...errors
            }));
        }

        try {
            const user = db.User.build(req.body, {
                fields: [
                    'name', 'username', 'email', 'phone', 'password'
                ]
            });
            user.name = req.body.fullName;
            user.secretCode = randomString(16);
            user.password = await bcrypt.hash(user.password, 6);
            user.isActive = true;
            user.role = req.body.role;
            await user.save();

            user.password = undefined;
            user.secretCode = undefined;
            return res.json({
                data: user
            });
        } catch (e) {
            return next(errorHttp(e));
        }
    }

    async requestToken(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new createError(400, "Lỗi tạo tài khoản", {
                ...errors
            }));
        }

        let token = null;
        try {
            const userData = await redisClient().hGetAll(req.body.rfToken);
            console.log(userData);
            if (!userData || !userData.id) {
                return next(new createError(400, "Token đã hết hạn"));
            }
            token = genJwt(userData);
        } catch (e) {
            return next(errorHttp(e));
        }

        return res.json({
            token
        })
    }
}