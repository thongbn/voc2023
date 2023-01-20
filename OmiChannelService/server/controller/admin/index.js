import {BaseController} from "./../BaseController";
import ConfigController from "./ConfigController";
import AuthController from "./AuthController";
import TicketController from "./TicketController";
import TemplateController from "./TemplateController";
import TagController from "./TagController";
import MediaController from "./MediaController";
import AuthenticateMiddleware from "../../middleware/AuthenticateMiddleware";

export default class AdminController extends BaseController {
    constructor() {
        super("/admin");
        this.registerRouter(new ConfigController(),[
            AuthenticateMiddleware
        ]);
        this.registerRouter(new AuthController());
        this.registerRouter(new TicketController(), [
            AuthenticateMiddleware
        ]);
        this.registerRouter(new TemplateController(), [
            AuthenticateMiddleware
        ]);
        this.registerRouter(new TagController(), [
            AuthenticateMiddleware
        ]);
        this.registerRouter(new MediaController(), [
            AuthenticateMiddleware
        ]);
    }
}