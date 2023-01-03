import db from "../models"

export const createRawData = async (platform, platformId, type, message) => {
    try {
        const model = await db.RawData.build({
            platform: platform,
            platformId,
            type,
            data: message,
        });
        await model.save();
        return model;
    } catch (e) {
        throw e;
    }
}