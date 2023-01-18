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
 * @returns {Keyword}
 */
module.exports = (sequelize) => {
    class Keyword extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Keyword.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    Keyword.init({
        key: DataTypes.STRING,
        tag_id: DataTypes.INTEGER,
        active: DataTypes.STRING(25),
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'Keyword',
        tableName: "keyword",
        timestamps: false,
        indexes: [
            {
                name: "keyword_key",
                fields: ['key', 'keyword_tag_id'],
            },
            {
                name: "keyword_tag_id",
                fields: ['keyword_tag_id', 'key'],
            }
        ]
    });

    return Keyword;
};