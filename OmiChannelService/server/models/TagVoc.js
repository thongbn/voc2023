'use strict';
const {
    Model,
    DataTypes,
    Sequelize
} = require('sequelize');


/**
 *
 * @param {Sequelize} sequelize
 * @returns {TagVoc}
 */
module.exports = (sequelize) => {
    class TagVoc extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // TagVoc.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    TagVoc.init({
        tag_name: DataTypes.STRING,
        active: DataTypes.STRING(25),
        color: DataTypes.STRING(50),
        category_id: DataTypes.INTEGER.UNSIGNED,
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'TagVoc',
        tableName: "tag",
        timestamps: false,
        indexes: [
            {
                name: 'slug',
                unique: true,
                fields: ['tag_name']
            },
            {
                name: 'idx_category_id',
                unique: true,
                fields: ['category_id']
            },
        ]
    });

    return TagVoc;
};