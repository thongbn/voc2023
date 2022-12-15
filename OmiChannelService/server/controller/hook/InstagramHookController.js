import {BaseController} from "../BaseController";

export default class InstagramHookController extends BaseController {
    constructor() {
        super("/instagram");
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