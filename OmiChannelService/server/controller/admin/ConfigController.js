import {BaseController} from "../BaseController";
import db from "../../models";
import {getOmiConfig, setOmiConfig} from "../../services/ConfigService";

export default class ConfigController extends BaseController {
    constructor() {
        super("/config");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/omi-config', this.index.bind(this));
        this.getRouter().post('/omi-config', this.update.bind(this));
        this.getRouter().post('/migrate-db', this.migrateDb.bind(this));
    }

    async index(req, res, next) {
        try{
            const settings = await getOmiConfig();
            return res.json({
                data: settings,
            })
        }catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
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
        try{
            const settings = await setOmiConfig({
                kafka,
                facebook,
                instagram
            });
            return res.json({
                data: settings,
            })
        }catch (e) {
            next(e);
        }
    }

    async migrateDb(req, res, next) {
        try {
            await db.sequelize.sync({alter: true});
            return res.json({
                success: true
            });
        } catch (e) {
            next(e);
        }
    }
}