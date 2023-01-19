'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');


module.exports = (sequelize) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Customer.init({
        platform: DataTypes.STRING(20),
        platformId: DataTypes.STRING,
        fullname: DataTypes.STRING,
        avatar: DataTypes.TEXT,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Customer',
        tableName: "customer"
    });

    return Customer;
};