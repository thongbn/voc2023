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
 * @returns {AnswerKeyword}
 */
module.exports = (sequelize) => {
    class AnswerKeyword extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // AnswerKeyword.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    AnswerKeyword.init({
        keyword: DataTypes.STRING,
        answer_id: DataTypes.INTEGER,
        active: DataTypes.STRING(25),
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
        is_exclude: DataTypes.TINYINT,
    }, {
        sequelize,
        modelName: 'AnswerKeyword',
        tableName: "answer_keyword",
        timestamps: false
    });

    return AnswerKeyword;
};