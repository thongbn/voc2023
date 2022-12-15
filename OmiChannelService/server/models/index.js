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
        charset: "utf8bm4",
    }
});

const db = {

};
// fs
//     .readdirSync(__dirname)
//     .filter(file => {
//         return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//     })
//     .forEach(file => {
//         const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//         db[model.name] = model;
//     });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
