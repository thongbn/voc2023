import {BaseController} from "./../BaseController";
import ConfigController from "./ConfigController";
import AuthController from "./AuthController";

export default class AdminController extends BaseController {
    constructor() {
        super("/admin");
        this.registerRouter(new ConfigController());
        this.registerRouter(new AuthController());
    }
}