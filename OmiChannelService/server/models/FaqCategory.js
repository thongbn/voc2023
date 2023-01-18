'use strict';
const {
    Model,
    DataTypes,
    Sequelize
} = require('sequelize');

import db from "./index";

/**
 *
 * @param {Sequelize} sequelize
 * @returns {FaqCategory}
 */
module.exports = (sequelize) => {
    class FaqCategory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            FaqCategory.hasMany(models.Faq, {
                sourceKey: "id",
                foreignKey: "category_id",
                as: "faqs"
            });
        }
    }

    FaqCategory.init({
        name: DataTypes.STRING,
        en_name: DataTypes.STRING,
        thumb_url: DataTypes.STRING,
        sort_order: DataTypes.SMALLINT,
        active: DataTypes.STRING(25),
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'FaqCategory',
        tableName: "faq_category",
        timestamps: false,
    });

    return FaqCategory;
};