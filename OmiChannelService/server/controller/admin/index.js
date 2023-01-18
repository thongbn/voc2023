import {BaseController} from "./../BaseController";
import ConfigController from "./ConfigController";
import AuthController from "./AuthController";
import TicketController from "./TicketController";

export default class AdminController extends BaseController {
    constructor() {
        super("/admin");
        this.registerRouter(new ConfigController());
        this.registerRouter(new AuthController());
        this.registerRouter(new TicketController());
    }
}