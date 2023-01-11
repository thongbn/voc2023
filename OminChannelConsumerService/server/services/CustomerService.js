import db from "../models"

export const findCustomerByPlatformId = async (platform, platformId) => {
    return await db.Customer.findOne({
        where: {
            platform,
            platformId
        }
    });
}

/**
 * 
 * @param {string} platform 
 * @param {string} platformId 
 * @returns {Customer}
 */
export const updateOrCreateCustomer = async (platform, platformId) => {
    //TODO Redis lock to create message
    let model = await findCustomerByPlatformId(platform, platformId);
    if (!model) {
        model = await db.Customer.build({
            platform,
            platformId
        });
    }
    //TODO Get User information from access token
    await model.save();
    return model;
}