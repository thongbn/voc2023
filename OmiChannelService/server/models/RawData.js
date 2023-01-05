'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');

import db from "./index";

module.exports = (sequelize) => {
    class RawData extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    RawData.init({
        messageId: DataTypes.INTEGER.UNSIGNED,
        platform: DataTypes.STRING(20),
        platformId: DataTypes.STRING,
        ts: "TIMESTAMP",
        type: DataTypes.STRING,
        data: DataTypes.JSON,
        isError: DataTypes.BOOLEAN,
        errorMessage: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'RawData',
        tableName: "rawMessage"
    });

    return RawData;
};