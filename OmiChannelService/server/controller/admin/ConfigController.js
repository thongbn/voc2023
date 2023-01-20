import {BaseController} from "../BaseController";
import db from "../../models";
import {getOmiConfig, setConfig, setOmiConfig} from "../../services/ConfigService";
import createError from "http-errors";

export default class ConfigController extends BaseController {
    constructor() {
        super("/config");
    }

    initRouter() {
        super.initRouter();        
        this.getRouter().get('/omi-config', this.omiConfig.bind(this));
        this.getRouter().post('/omi-config', this.updateOmiConfig.bind(this));
        this.getRouter().post('/migrate-db', this.migrateDb.bind(this));
        this.getRouter().get('/:key', this.index.bind(this));
        this.getRouter().post('/:key', this.update.bind(this));
    }

    async index(req, res, next) {
        try {
            const {key} = req.body;
            const settings = await getConfig(key);
            return res.json({
                data: settings,
            })
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const {key, data} = req.body;
            if(!key && !data){
                throw new createError(400, "Dư liệu không đủ");
            }
            const settings = await setConfig(key, data);
            return res.json({
                data: settings,
            })
        } catch (e) {
            next(e);
        }
    }

    async omiConfig(req, res, next) {
        try {
            const settings = await getOmiConfig();
            return res.json({
                data: settings,
            })
        } catch (e) {
            next(e);
        }
    }

    async updateOmiConfig(req, res, next) {
        const {
            kafka = {
                brokers: process.env.KAFKA_BROKER,
                clientId: process.env.KAFKA_CLIENT_ID,
            }, facebook = {
                topic: process.env.KAFKA_TOPIC_FB,
                verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
                appSecret: process.env.FACEBOOK_APP_SECRET,
                pageId: process.env.FACEBOOK_PAGE_ID,
            }, instagram = {
                topic: process.env.KAFKA_TOPIC_INSTAGRAM,
                verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
                appSecret: process.env.FACEBOOK_APP_SECRET,
                pageId: process.env.INSTAGRAM_ACC_ID
            }
        } = req.body;
        try {
            const settings = await setConfig("omi-config", {
                kafka,
                facebook,
                instagram
            });
            return res.json({
                data: settings,
            });
        } catch (e) {
            next(e);
        }
    }

    async migrateDb(req, res, next) {
        try {
            await db.MediaManager.sync({alter: true});
            return res.json({
                success: true
            });
        } catch (e) {
            next(e);
        }
    }
}