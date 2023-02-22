import {checkSchema} from "express-validator";
import {getFacebookSettings, getZaloSettings} from "../services/ConfigService";
import crypto from "crypto";
import {trim} from "validator";

const ZaloVerifySchema = () => {
    return checkSchema({
        "x-zevent-signature": {
            in: "headers",
            notEmpty: {
                bail: true,
                errorMessage: "Không được trống"
            },
            custom: {
                bail: true,
                options: async (value, {req, location, path}) => {
                    try {
                        let [head, hash] = value.split("=");
                        if (!hash) {
                            return Promise.reject("hash null");
                        }
                        const settings = await getZaloSettings();
                        const expectedHash = crypto
                            .createHash("sha256")
                            .update(`${settings.appId}${req.rawBody}${req.body.timestamp}${settings.oaSecretKey}`
                                , 'utf-8')
                            .digest("hex");
                        if (hash !== expectedHash) {
                            console.log(hash, expectedHash);
                            return Promise.reject("Could not validate request signature");
                        }
                    } catch (e) {
                        console.error(e);
                        return Promise.reject("Could not validate request signature");
                    }

                    return Promise.resolve();
                },
            }
        },
    })
};

export default ZaloVerifySchema;