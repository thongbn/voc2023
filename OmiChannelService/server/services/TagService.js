import db from "../models";
import createError from "http-errors";

export const getTagById = async (id, attributes = ["*"]) => {
    const tag = await db.TagVoc.findOne({
        attributes: attributes,
        where: {
            id: id
        }
    });

    if (!tag) {
        throw createError(404, `Tag ${id} not founded`);
    }

    return tag;
};

export const getTagModel = async (tagId, modelId, modelType) => {
    return await db.TagModel.findOne({
        where: {
            tag_id: tagId,
            model_id: modelId,
            model_type: modelType,
        }
    });
};

export const getTagsByModelId = async (modelId, modelType, attributes = ["*"]) => {
    return await db.TagModel.findAll({
        where: {
            model_id: modelId,
            model_type: modelType,
        },
        attributes: ["tag_id", 'model_id', 'model_type'],
        include: [
            {
                model: db.TagVoc,
                as: "tag",
                attributes,
            }
        ]
    });
};