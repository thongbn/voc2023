// import AuthController from "../controller/AuthController";
// import UserController from "../controller/UserController";
// import AppointmentController from "../controller/AppointmentController";
// import DashboardController from "../controller/DashboardController";
// import MemberController from "../controller/MemberController";
// import PromotionController from "../controller/PromotionController";
// import TransactionController from "../controller/TransactionController";
// import SmileUpController from "../controller/smileup";
// import AuthenticateMiddleware from "../middleware/AuthenticateMiddleware";
// import ReportController from "../controller/ReportController";

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
    // registerRouter(app, new AuthController());
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