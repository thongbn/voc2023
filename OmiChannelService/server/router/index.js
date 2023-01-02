import HookController from "../controller/hook";

/**
 *
 * @param app
 * @param baseController
 */
const registerRouter = (app, baseController, middlewares = []) => {
    console.log("Add route:", baseController.getPath());
    app.use(baseController.getPath(), ...middlewares, baseController.getRouter());
};

const initRouter = (app) => {
    registerRouter(app, new HookController());
    // registerRouter(app, new AppointmentController(), [AuthenticateMiddleware]);
    // registerRouter(app, new UserController());
    // registerRouter(app, new DashboardController(), [AuthenticateMiddleware]);
    // registerRouter(app, new MemberController(), [AuthenticateMiddleware]);
    // registerRouter(app, new PromotionController(), [AuthenticateMiddleware]);
    // registerRouter(app, new TransactionController(), [AuthenticateMiddleware]);
    // registerRouter(app, new ReportController(), [AuthenticateMiddleware]);
    // registerRouter(app, new SmileUpController());
};

export default initRouter;