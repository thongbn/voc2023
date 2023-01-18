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
 * @returns {FaqButton}
 */
module.exports = (sequelize) => {
    class FaqButton extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // FaqButton.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    FaqButton.init({
        icon: DataTypes.STRING,
        href: DataTypes.TEXT,
        type: DataTypes.STRING(50),
        title: DataTypes.TEXT,
        final: DataTypes.TEXT,
        en_title: DataTypes.TEXT,
        sort: DataTypes.INTEGER,
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'FaqButton',
        tableName: "faq_button",
        timestamps: false,
    });

    return FaqButton;
};