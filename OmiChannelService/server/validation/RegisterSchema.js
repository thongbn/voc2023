import {checkSchema} from "express-validator";
import db from "../models";

const RegisterSchema = () => {
    return checkSchema({
        username: {
            in: "body",
            notEmpty: {
                bail: true,
                errorMessage: "Username không được rỗng"
            },
            custom: {
                bait: true,
                options: (value, {req, location, path}) => {
                    return db.User.findOne({
                        where: {
                            username: value
                        }
                    }).then(user => {
                        if (user) {
                            return Promise.reject("Username đã tồn tại");
                        }
                    })
                },
            },
        },
        email: {
            in: "body",
            notEmpty: {
                bail: true,
                errorMessage: "Email không được rỗng"
            },
            isEmail: {
                bait: true,
                errorMessage: "Sai định dạng email"
            },
            normalizeEmail: true,
        },
        fullName: {
            in: "body",
            trim: true,
            notEmpty: {
                bail: true,
                errorMessage: "Vui lòng nhập đầy đủ họ và tên"
            },
        },
        phone: {
            in: "body",
            isLength: {
                bail: true,
                options: {min: 10, max: 10},
                errorMessage: "Vui lòng nhập đúng định dạng (0xxxxxxx)"
            }
        },
        password: {
            in: "body",
            notEmpty: {
                bail: true,
                errorMessage: "Mật khẩu không được rỗng"
            },
            isLength: {
                bait: true,
                errorMessage: "Mật khẩu gồm 8 ký tự",
                options: {min: 8}
            }
        },
        role: {
            in: "body",
            trim: true,
            notEmpty: {
                bail: true,
                errorMessage: "Vui lòng nhập role"
            },
            custom: {
                bait: true,
                options: (value, {req, location, path}) => {
                    if(["sAdmin", "admin", "aeonSupport", "support"].indexOf(value) !== -1){
                        return Promise.reject("Role không tồn tại");
                    }
                    return Promise.resolve();
                },
            },
        },
    })
};

export default RegisterSchema;