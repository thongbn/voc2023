import createError from 'http-errors';
import {errorHttp} from "../helper/util";

const AuthorizationMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            throw new createError(401, "Không có quyền truy cập (1)");
        }

        if(!req.user.role){
            throw new createError(401, "Không có quyền truy cập (2)");
        }

        next();
    }catch (e) {
        if(e instanceof TokenExpiredError){
            next(createError(403, "Không có quyền truy cập (3)"));
        }else{
            next(errorHttp(e));
        }
    }
};

export default AuthorizationMiddleware;