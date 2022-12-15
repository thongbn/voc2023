import {BaseController} from "./BaseController";

export default class AuthController extends BaseController {
    constructor() {
        super("/auth");
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