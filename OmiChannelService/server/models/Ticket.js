'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');

import db from "./index";

module.exports = (sequelize) => {
    class Ticket extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Ticket.init({
        platform: DataTypes.STRING(20),
        platformId: DataTypes.STRING,
        cId: DataTypes.STRING,
        mediaId: DataTypes.STRING,
        customerId: DataTypes.INTEGER.UNSIGNED,
        type: DataTypes.STRING(20),
        caseStatus: DataTypes.STRING(20),
        processStatus: DataTypes.STRING(20),
        firstMessage: DataTypes.STRING,
        lcm: DataTypes.STRING,
        lcmTime: "TIMESTAMP",
        lrmTime: "TIMESTAMP",
        vocMessage: DataTypes.TEXT,
        vocMessageEn: DataTypes.TEXT,
        vocNote: DataTypes.TEXT,
        vocNoteEn: DataTypes.TEXT,
        userClose: DataTypes.INTEGER.UNSIGNED,
        closedDate: "TIMESTAMP"
    }, {
        sequelize,
        modelName: 'Ticket',
        tableName: "ticket",
        indexes: [
            {
                name: "t_p_tu",
                fields: ['platform', 'platformId', 'cId', 'type', 'caseStatus'],
            }
        ]
    });

    return Ticket;
};