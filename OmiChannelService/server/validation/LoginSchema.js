import {checkSchema} from "express-validator";

const LoginSchema = () => {
    return checkSchema({
        username: {
            in: "body",
            notEmpty: {
                bail: true,
                errorMessage: "Username không được rỗng"
            },
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
    })
};

export default LoginSchema;