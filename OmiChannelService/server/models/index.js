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
    User: require("./User")(sequelize, Sequelize.DataTypes),
    Setting: require("./Setting")(sequelize, Sequelize.DataTypes),
    RawData: require("./RawData")(sequelize, Sequelize.DataTypes),
    Message: require("./Message")(sequelize, Sequelize.DataTypes),
    Ticket: require("./Ticket")(sequelize, Sequelize.DataTypes),
    Customer: require("./Customer")(sequelize, Sequelize.DataTypes),
    // Post: require("./Post")(sequelize, Sequelize.DataTypes),
};

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
