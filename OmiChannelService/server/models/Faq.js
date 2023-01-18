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
 * @returns {Faq}
 */
module.exports = (sequelize) => {
    class Faq extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Faq.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    Faq.init({
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
        category_id: DataTypes.INTEGER,
        sort_order: DataTypes.SMALLINT,
        active: DataTypes.STRING(25),
        en_title: DataTypes.STRING,
        en_content: DataTypes.TEXT,
        button_id: DataTypes.STRING(25),
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'Faq',
        tableName: "faq",
        timestamps: false,
    });

    return Faq;
};