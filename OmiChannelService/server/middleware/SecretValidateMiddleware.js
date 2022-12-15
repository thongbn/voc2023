import createError from 'http-errors';
import {errorHttp} from "../helper/util";

const SecretValidateMiddleware = (req, res, next) => {
    try {
        const authString = req.headers['authorization'];
        if (!authString) {
            throw new createError(401, "Không có quyền truy cập");
        }

        if (!authString.includes('Bearer ')) {
            throw new createError(401, "Không có quyền truy cập");
        }

        const token = authString.substr(7);

        if (!token === process.env.SECRET_KEY_APP) {
            throw new createError(401, "Không có quyền truy cập");
        }
        req.isHookUser = true;
        next();
    } catch (e) {
        next(errorHttp(e));
    }
};

export default SecretValidateMiddleware;