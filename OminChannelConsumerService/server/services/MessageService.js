import db from "../models"

export const findMessageByMid = async (platform, mid) => {
    return await db.Message.findOne({
        where: {
            platform,
            platformId: mid,
        }
    })
};

export const updateOrCreateMessage = async (platform, mid) => {
    //TODO Lock mid
    let model = await findMessageByMid(platform, mid);
    if (!model) {
        model = db.Message.build({
            platform,
            platformId: mid,
            isDeleted: false,
        });
    }

    //TODO May be can get data from mid
    await model.save();
    return model;
}