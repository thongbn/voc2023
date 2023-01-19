'use strict';
const {
    Model,
    DataTypes,
    Sequelize
} = require('sequelize');


/**
 * @param {Sequelize} sequelize
 * @returns {User}
 */
module.exports = (sequelize) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    User.init({
        name: DataTypes.STRING,
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        password: DataTypes.STRING,
        secretCode: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
        role: DataTypes.STRING(20),
    }, {
        sequelize,
        modelName: 'User',
        tableName: "user",
    });

    return User;
};