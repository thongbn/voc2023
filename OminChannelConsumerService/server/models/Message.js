'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Message.init({
        ticketId: DataTypes.INTEGER.UNSIGNED,
        platform: DataTypes.STRING(20),
        platformId: DataTypes.STRING,
        customerId: DataTypes.INTEGER.UNSIGNED,
        type: DataTypes.STRING,
        data: DataTypes.JSON,
    }, {
        sequelize,
        modelName: 'Message',
        tableName: "message"
    });

    return Message;
};