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
 * @returns {AnswerManager}
 */
module.exports = (sequelize) => {
    class AnswerManager extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // AnswerManager.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    AnswerManager.init({
        content: DataTypes.TEXT,
        sort_order: DataTypes.INTEGER,
        color: DataTypes.STRING(50),
        active: DataTypes.STRING(25),
        max_words: DataTypes.INTEGER,
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'AnswerManager',
        tableName: "answer_manager",
        timestamps: false
    });

    return AnswerManager;
};