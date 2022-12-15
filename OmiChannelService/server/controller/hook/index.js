import {BaseController} from "./../BaseController";
import FacebookHookController from "./FacebookHookController";
import InstagramHookController from "./InstagramHookController";
import ZaloHookController from "./ZaloHookController";

export default class HookController extends BaseController {
    constructor() {
        super("/hook");
        this.registerRouter(new FacebookHookController());
        this.registerRouter(new InstagramHookController());
        this.registerRouter(new ZaloHookController());
    }
}