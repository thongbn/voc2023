import {checkSchema} from "express-validator";
import {getFacebookSettings} from "../../services/ConfigService";
import crypto from 'crypto';

const FacebookVerifyHookData = () => {
    return checkSchema({
        "x-hub-signature-256": {
            in: "headers",
            notEmpty: {
                bail: true,
                errorMessage: "Không được trống"
            },
            custom: {
                bail: true,
                options: async (value, {req, location, path}) => {
                    try{
                        let [head, hash] = value.split("=");
                        if (!hash) {
                            return Promise.reject("hash null");
                        }
                        const fbSettings = await getFacebookSettings();
                        const expectedHash = crypto
                            .createHmac("sha256", fbSettings.appSecret)
                            .update(req.rawBody, 'utf-8')
                            .digest("hex");
                        if(hash !== expectedHash){
                            console.log(hash, expectedHash);
                            return Promise.reject("Could not validate request signature");
                        }
                    }catch (e) {
                        console.error(e);
                        return Promise.reject("Could not validate request signature");
                    }

                    return Promise.resolve();
                },
            }
        },
    })
};

export default FacebookVerifyHookData;