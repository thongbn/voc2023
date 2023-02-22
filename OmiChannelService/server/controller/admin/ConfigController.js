import {BaseController} from "../BaseController";
import db from "../../models";
import {getConfig, getOmiConfig, setConfig, setOmiConfig} from "../../services/ConfigService";
import createError from "http-errors";
import {graphApiPost} from "../../helper/graph-helper";
import {GET_STARTED_POSTBACK} from "../../helper/appConst";

export default class ConfigController extends BaseController {
    constructor() {
        super("/config");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/omi-config', this.omiConfig.bind(this));
        this.getRouter().post('/omi-config', this.updateOmiConfig.bind(this));
        this.getRouter().post('/migrate-db', this.migrateDb.bind(this));
        this.getRouter().post('/ig/persisted-menu', this.updateIgPersistedMenu.bind(this));
        this.getRouter().post('/fb/get-started-btn', this.updateFbGetStartedButton.bind(this));
        this.getRouter().get('/:key', this.index.bind(this));
        this.getRouter().post('/:key', this.update.bind(this));
    }

    async updateIgPersistedMenu(req, res, next) {
        try {
            await graphApiPost("/me/messenger_profile"
                , {
                    "persistent_menu": [
                        {
                            "locale": "default",
                            "call_to_actions": [
                                {
                                    "title": "🔔 Click để được hỗ trợ",
                                    "type": "postback",
                                    "payload": GET_STARTED_POSTBACK
                                }
                            ]
                        }
                    ]
                }
                , "page"
                , {
                    platform: "instagram"
                });
            return res.json({
                success: true
            });
        } catch (e) {
            next(e);
        }
    }

    async updateFbGetStartedButton(req, res, next) {
        try {
            const {greetingText} = req.body;
            await graphApiPost("/me/messenger_profile"
                , {
                    "get_started": {
                        "payload": GET_STARTED_POSTBACK
                    },
                    "greeting": [
                        {
                            "locale": "default",
                            "text": greetingText
                        }
                    ],
                    "persistent_menu": [
                        {
                            "locale": "default",
                            "composer_input_disabled": false,
                            "call_to_actions": [
                                {
                                    "title": "🔔 Click để được hỗ trợ",
                                    "type": "postback",
                                    "payload": GET_STARTED_POSTBACK
                                }
                            ]
                        }
                    ]
                }
                , "page"
                , {
                });
            return res.json({
                success: true
            });
        } catch (e) {
            next(e);
        }
    }

    async index(req, res, next) {
        try {
            const {key} = req.params;
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
            const {key} = req.params;
            const {data} = req.body;
            if (!key && !data) {
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
            kafka = {}
            , facebook = {}
            , instagram = {}
            , zalo = {}
        } = req.body;
        try {
            const settings = await setConfig("omi-config", {
                kafka,
                facebook,
                instagram,
                zalo
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