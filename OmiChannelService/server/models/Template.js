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
 * @returns {Template}
 */
module.exports = (sequelize) => {
    class Template extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Template.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    Template.init({
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
        type: DataTypes.INTEGER,
        sort_order: DataTypes.SMALLINT,
        category_id: DataTypes.INTEGER,
        status: {
            type: DataTypes.SMALLINT,
            default: 0
        },
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'Template',
        tableName: "template",
        timestamps: false,
        indexes: [
            {
                name: 'title_idx',
                fields: ['title', {
                    name: 'sort_order',
                    order: "DESC"
                }]
            },
        ]
    });

    return Template;
};