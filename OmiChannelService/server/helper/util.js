import jwt from "jsonwebtoken";
import createError from "http-errors";

export const randomString = (length, characters) => {
    if (!characters) {
        characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*|?";
    }
    let result = '';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
};

export const genRefreshTokenKey = (user) => {
    return `userRf${user.id}`;
};

export const genJwt = (user) => {
    return jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            iat: Math.floor(Date.now() / 1000),
        }
        , process.env.JWT_KEY
        , {
            expiresIn: '24h'
        });
};

export const errorHttp = (error) => {
    console.error(error);
    if (error.status) {
        return error;
    }
    return createError(500, error.message ? error.message : "Internal server error");
};

export const getUser = (req) => {
    return req.user;
};

export const isHookUser = (req) => {
    return req.isHookUser;
};

export const log = (title, error) => {

};