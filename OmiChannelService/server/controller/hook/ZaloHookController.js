import {BaseController} from "../BaseController";

export default class ZaloHookController extends BaseController {
    constructor() {
        super("/zalo");
    }

    initRouter() {
        super.initRouter();
        this.getRouter().get('/', this.index.bind(this));
    }

    async index(req, res, next) {
        return res.json({
            path: this.getPath()
        });
    }
}