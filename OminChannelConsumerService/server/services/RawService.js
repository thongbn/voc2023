import db from "../models"

/**
 * 
 * @param {string} platform 
 * @param {string} platformId 
 * @param {number} ts
 * @param {string} type 
 * @param {string} message 
 * @returns RawData
 */
export const createRawData = async (platform, platformId, ts, type, message) => {
    try {
        const model = await db.RawData.build({
            platform,
            platformId,
            ts: new Date(ts),
            type,
            data: message,
            isError: false
        });
        await model.save();
        return model;
    } catch (e) {
        throw e;
    }
}