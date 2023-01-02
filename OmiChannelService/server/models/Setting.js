'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');

import db from "./index";

module.exports = (sequelize) => {
    class Setting extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Setting.init({
        name: DataTypes.STRING,
        data: DataTypes.JSON,
    }, {
        sequelize,
        modelName: 'Setting',
        tableName: "setting",
        indexes: [
            {
                name: "setting_key",
                unique: true,
                fields: ['name']
            }
        ]
    });

    return Setting;
};