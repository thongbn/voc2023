import {checkSchema} from "express-validator";

const RenewTokenSchema = () => {
    return checkSchema({
        rfToken: {
            in: "body",
            notEmpty: {
                bail: true,
            }
        }
    })
};

export default RenewTokenSchema;