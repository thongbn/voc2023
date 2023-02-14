'use strict';
const {
    Model,
    DataTypes,
    Sequelize
} = require('sequelize');


/**
 *
 * @param {Sequelize} sequelize
 * @returns {MediaManager}
 */
module.exports = (sequelize) => {
    class MediaManager extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // MediaManager.hasOne(models.Customer, {
            //     foreignKey: "id",
            //     sourceKey: "customerId",
            //     as: "customer"
            // });
        }
    }

    MediaManager.init({
        mime: DataTypes.STRING(25),
        name: DataTypes.STRING,
        hash: DataTypes.STRING,
        path: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'MediaManager',
        tableName: "media_manager"
    });

    return MediaManager;
};