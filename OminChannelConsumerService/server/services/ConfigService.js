import {redisClient} from "../RedisClient";
import db from "../models";

export const getFacebookSettings = async () => {
    const settings = await getOmiConfig();
    return {
        verifyToken: settings.facebook.verifyToken,
        appSecret: settings.facebook.appSecret,
        accessToken: settings.facebook.accessToken,
    }
};

export const getInstgramSettings = async () => {
    const settings = await getOmiConfig();
    return {
        verifyToken: settings.instagram.verifyToken,
        appSecret: settings.instagram.appSecret,
        accessToken: settings.instagram.accessToken,
    }
};

export const getKafkaSettings = async () => {
    const settings = await getOmiConfig();
    return settings.kafka;
};

export const setOmiConfig = async (settings) => {
    try {
        //Get from redis
        const keyName = "omi-config";
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
        model.data = JSON.stringify(settings);
        await model.save();

        await redisClient().set(keyName, model.data);
        return JSON.parse(model.data);
    } catch (e) {
        throw e;
    }
};

export const getOmiConfig = async () => {
    try {
        //Get from redis
        const keyName = "omi-config";
        let settings = await redisClient().get(keyName);
        if (settings) {
            return JSON.parse(settings);
        }

        //Get settings from db
        let model = await db.Setting.findOne({
            where: {
                "name": keyName,
            }
        });

        if (!model) {
            const defaultSetting = {
                kafka: {
                    brokers: process.env.KAFKA_BROKER,
                    clientId: process.env.KAFKA_CLIENT_ID,
                }, facebook: {
                    topic: process.env.KAFKA_TOPIC_FB,
                    verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
                    appSecret: process.env.FACEBOOK_APP_SECRET,
                    accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
                }, instagram: {
                    topic: process.env.KAFKA_TOPIC_INSTAGRAM,
                    verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
                    appSecret: process.env.FACEBOOK_APP_SECRET,
                    accessToken: process.env.INSTGRAM_ACCESS_TOKEN,
                }
            };
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