import {redisClient} from "../database/RedisClient";
import db from "../models";
import {FB_LONG_LIVE_TOKEN_KEY} from "../helper/appConst";

export const getFacebookSettings = async () => {
    const settings = await getOmiConfig();
    return {
        verifyToken: settings.facebook.verifyToken,
        appSecret: settings.facebook.appSecret
    }
};

export const getKafkaConfig = async () => {
    const {kafka} = await getOmiConfig();
    return kafka;
};

export const setConfig = async (keyName, settingData = {}) => {
    try {
        //Get from redis
        //Get settings from db
        let model = await db.Setting.findOne({
            where: {
                "name": keyName,
            }
        });
        if (!model) {
            model = db.Setting.build({
                name: keyName,
            });
        }
        model.data = JSON.stringify(settingData);
        await model.save();

        await redisClient().set(keyName, model.data);
        return JSON.parse(model.data);
    } catch (e) {
        throw e;
    }
};

export const getConfig = async (keyName, defaultSetting = {}) => {
    let settings;
    try{
        settings = await redisClient().get(keyName);
        if (settings) {
            return JSON.parse(settings);
        }
    }catch (e) {
        console.error(e);
    }

    try {
        //Get from redis
        //Get settings from db
        let model = await db.Setting.findOne({
            where: {
                "name": keyName,
            }
        });

        if (!model) {
            model = db.Setting.build({
                name: keyName,
                data: JSON.stringify(defaultSetting)
            });
            await model.save();
        }
        await redisClient().set(keyName, model.data);
        return JSON.parse(model.data);
    } catch (e) {
        throw e;
    }
};

export const getOmiConfig = async () => {
    return await getConfig("omi-config", {
        kafka: {
            brokers: process.env.KAFKA_BROKER,
            clientId: process.env.KAFKA_CLIENT_ID,
        }, facebook: {
            topic: process.env.KAFKA_TOPIC_FB,
            verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
            appSecret: process.env.FACEBOOK_APP_SECRET
        }, instagram: {
            topic: process.env.KAFKA_TOPIC_INSTAGRAM,
            verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
            appSecret: process.env.FACEBOOK_APP_SECRET
        }
    })
};

export const getFbLLTToken = async () => {
    const data = await getConfig(FB_LONG_LIVE_TOKEN_KEY);
    return data.llt;
};

export const getFbMessToken = async () => {
    const data = await getConfig(FB_LONG_LIVE_TOKEN_KEY);
    return data.fbMessToken;
};