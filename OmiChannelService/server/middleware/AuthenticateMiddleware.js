import createError from 'http-errors';
import {verify, decode, TokenExpiredError} from 'jsonwebtoken';
import {errorHttp} from "../helper/util";

const AuthenticateMiddleware = (req, res, next) => {
    try {
        const authString = req.headers['authorization'];
        if (!authString) {
            throw new createError(401, "Không có quyền truy cập (1)");
        }

        if (!authString.includes('Bearer ')) {
            throw new createError(401, "Không có quyền truy cập (2)");
        }

        const token = authString.substr(7);
        verify(token, process.env.JWT_KEY);
        req.user = decode(token);
        next();
    }catch (e) {
        if(e instanceof TokenExpiredError){
            next(createError(403, "Không có quyền truy cập (3)"));
        }else{
            next(errorHttp(e));
        }
    }
};

export default AuthenticateMiddleware;