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
 * @returns {FaqTagKeyCategory}
 */
module.exports = (sequelize) => {
    class FaqTagKeyCategory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // FaqTagKeyCategory.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    FaqTagKeyCategory.init({
        name: DataTypes.TEXT,
        en_name: DataTypes.TEXT,
        thumb_url: DataTypes.STRING,
        sort_order: DataTypes.SMALLINT,
        active: DataTypes.STRING(25),
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'FaqTagKeyCategory',
        tableName: "faq_tagkey_category",
        timestamps: false,
    });

    return FaqTagKeyCategory;
};