'use strict';
const {
    Model,
    DataTypes,
    Sequelize
} = require('sequelize');


/**
 *
 * @param {Sequelize} sequelize
 * @returns {FaqTagKeyCategory}
 */
module.exports = (sequelize) => {
    class TagCategory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            TagCategory.hasMany(models.TagVoc, {
                foreignKey: "category_id",
                sourceKey: "id",
                as: "tags"
            });
        }
    }

    TagCategory.init({
        name: DataTypes.TEXT,
        en_name: DataTypes.TEXT,
        thumb_url: DataTypes.STRING,
        sort_order: DataTypes.SMALLINT,
        active: DataTypes.STRING(25),
        created_at: DataTypes.INTEGER.UNSIGNED,
        updated_at: DataTypes.INTEGER.UNSIGNED,
    }, {
        sequelize,
        modelName: 'TagCategory',
        tableName: "tag_category",
        timestamps: false,
    });

    return TagCategory;
};