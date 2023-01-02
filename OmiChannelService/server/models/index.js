'use strict';
import fs from 'fs';
import path from 'path';
import * as dbConfig from "../../config/database.js";
import {Sequelize} from "sequelize";

const basename = path.basename(__filename);

let sequelize;
console.log("DB config", dbConfig);
sequelize = new Sequelize({
    ...dbConfig,
    dialectOptions: {
        useUTC: false,
    },
    timezone: "+07:00",
    define: {
        charset: "utf8mb4",
    }
});

const db = {
    // User: require(path.join(__dirname, "user"))(sequelize, Sequelize.DataTypes),
    Setting: require(path.join(__dirname, "Setting"))(sequelize, Sequelize.DataTypes),
    RawData: require(path.join(__dirname, "RawData"))(sequelize, Sequelize.DataTypes),
};

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
