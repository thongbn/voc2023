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
 * @returns {ScriptButton}
 */
module.exports = (sequelize) => {
    class ScriptButton extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // ScriptButton.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    ScriptButton.init({
        button_id: DataTypes.INTEGER,
        bot_script_id: DataTypes.INTEGER,
        sort_order: DataTypes.SMALLINT,
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'ScriptButton',
        tableName: "scripts_buttons",
        timestamps: false,
        indexes: [
            {
                name: 'button_id',
                fields: ['button_id', 'bot_script_id']
            }
        ]
    });

    return ScriptButton;
};