'use strict';
const {
    Model,
    DataTypes,
    Sequelize
} = require('sequelize');


/**
 *
 * @param {Sequelize} sequelize
 * @returns {TemplateCategory}
 */
module.exports = (sequelize) => {
    class TemplateCategory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // TemplateCategory.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    TemplateCategory.init({
        name: DataTypes.STRING,
        sort_order: DataTypes.SMALLINT,
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'TemplateCategory',
        tableName: "template_category",
        timestamps: false,
    });

    return TemplateCategory;
};