import express from 'express';

export class BaseController {
    constructor(path) {
        this.path = path;
        this.router = express.Router();
        this.initRouter();
    }

    initRouter() {

    }

    getPath() {
        return this.path;
    }

    getRouter() {
        return this.router;
    }

    /**
     *
     * @param baseController
     * @param middlewares
     */
    registerRouter(baseController, middlewares = []){
        this.getRouter().use(baseController.getPath()
            , ...middlewares
            , baseController.getRouter());
    };
}