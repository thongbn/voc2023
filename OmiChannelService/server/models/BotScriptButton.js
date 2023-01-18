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
 * @returns {BotScriptButton}
 */
module.exports = (sequelize) => {
    class BotScriptButton extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // BotScriptButton.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    BotScriptButton.init({
        type: DataTypes.STRING(100),
        icon: DataTypes.STRING(100),
        title: DataTypes.TEXT,
        payload: DataTypes.STRING,
        webview_height_ratio: DataTypes.STRING(100),
        messenger_extensions: DataTypes.SMALLINT,
        fallback_url: DataTypes.STRING,
        callback: DataTypes.STRING,
        url_param: DataTypes.STRING,
        is_persisted: DataTypes.SMALLINT,
        data: DataTypes.JSON,
        platform: DataTypes.STRING(20),
        platformId: DataTypes.STRING,
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'BotScriptButton',
        tableName: "bot_script_button",
        timestamps: false,
        indexes: [
            {
                name: "platform_idx",
                fields: ['platform', 'platformId']
            }
        ]
    });

    return BotScriptButton;
};