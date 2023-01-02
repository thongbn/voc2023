import {checkSchema} from "express-validator";

const FacebookVerifySchema = () => {
    return checkSchema({
        "hub.mode": {
            in: "query",
            notEmpty: {
                bail: true,
                errorMessage: "Thieu hub mode"
            },
        },
        "hub.challenge": {
            in: "query",
            notEmpty: {
                bail: true,
                errorMessage: "Thiếu hub challenge"
            },
        },
        "hub.verify_token": {
            in: "query",
            notEmpty: {
                bail: true,
                errorMessage: "Thiếu verify_token"
            },
        },
    })
};

export default FacebookVerifySchema;