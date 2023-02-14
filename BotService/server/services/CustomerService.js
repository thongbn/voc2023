import db from "../models"
import {PLATFORM_FB, PLATFORM_IG} from "../appConst";
import {getCustomerInfoViaPsId} from "./GraphApiService";

export const findCustomerByPlatformId = async (platform, platformId) => {
    return await db.Customer.findOne({
        where: {
            platform,
            platformId
        }
    });
};

export const getCustomerById = async (customerId) => {
    return await db.Customer.findOne({
        where: {
            id: customerId,
        }
    });
};

/**
 *
 * @param {string} platform
 * @param {string} platformId
 * @param {string} customerName
 * @param {boolean} updateViaApi
 * @returns {Customer}
 */
export const updateOrCreateCustomer = async (platform, platformId, customerName = "", updateViaApi = true) => {
    //TODO Redis lock to create message
    let model = await findCustomerByPlatformId(platform, platformId);
    if (!model) {
        model = await db.Customer.build({
            platform,
            platformId,
            fullname: customerName
        });
        await model.save();
    }
    //TODO Update User information from psId
    if(updateViaApi){
        switch (platform) {
            case PLATFORM_FB: {
                updateModelFromFb(platformId, model).catch(e => console.error(e));
                break;
            }
            case PLATFORM_IG:
                updateModelFromIg(platformId, model).catch(e => console.error(e));
                break;
        }
    }

    return model;
};

/**
 *
 * @param psId {string}
 * @param model
 * @returns {Promise<void>}
 */
const updateModelFromFb = async (psId, model) => {
    const socialData = await getCustomerInfoViaPsId(psId);
    const {name, profile_pic, first_name, last_name} = socialData;
    if (first_name || last_name) {
        model.fullname = `${first_name ? first_name : ""} ${last_name ? last_name : ""}`;
    } else if (name) {
        model.fullname = `${name ? name : "Unknown"}`;
    }
    model.avatar = profile_pic ? profile_pic : null;
    await model.save();
};

/**
 *
 * @param psId {string}
 * @param model
 * @returns {Promise<void>}
 */
const updateModelFromIg = async (psId, model) => {
    const socialData = await getCustomerInfoViaPsId(psId);
    const {name, profile_pic} = socialData;
    model.fullname = `${name ? name : "Unknown"}`;
    model.avatar = profile_pic ? profile_pic : null;
    await model.save();
};