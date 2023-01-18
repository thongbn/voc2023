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
 * @returns {BotScript}
 */
module.exports = (sequelize) => {
    class BotScript extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // BotScript.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    BotScript.init({
        title: DataTypes.TEXT,
        parent: DataTypes.INTEGER,
        type: DataTypes.STRING(100),
        unique_id: DataTypes.STRING,
        is_persisted: DataTypes.SMALLINT,
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'BotScript',
        tableName: "bot_script",
        timestamps: false,
        indexes: [
            {
                name: "unique_id",
                fields: ['unique_id']
            }
        ]
    });

    return BotScript;
};