import {BaseController} from "./../BaseController";
import ConfigController from "./ConfigController";

export default class AdminController extends BaseController {
    constructor() {
        super("/admin");
        this.registerRouter(new ConfigController());
    }
}