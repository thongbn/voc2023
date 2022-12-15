import {BaseController} from "../BaseController";

export default class FacebookHookController extends BaseController {
    constructor() {
        super("/facebook");
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