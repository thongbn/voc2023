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
 * @returns {TagModel}
 */
module.exports = (sequelize) => {
    class TagModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // TagModel.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    TagModel.init({
        tag_id: DataTypes.INTEGER,
        model_id: DataTypes.INTEGER,
        model_type: DataTypes.STRING(50),
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'TagModel',
        tableName: "tag_model",
        timestamps: false,
        indexes: [
            {
                name: 'tag_model_idx1',
                unique: true,
                fields: ['tag_id', 'model_id', 'model_type']
            },
            {
                name: 'tag_model_idx3',
                unique: true,
                fields: ['tag_id', 'model_type']
            },
        ]
    });

    return TagModel;
};