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
    Setting: require("./Setting")(sequelize, Sequelize.DataTypes),
    RawData: require("./RawData")(sequelize, Sequelize.DataTypes),
    Message: require("./Message")(sequelize, Sequelize.DataTypes),
    Ticket: require("./Ticket")(sequelize, Sequelize.DataTypes),
    Customer: require("./Customer")(sequelize, Sequelize.DataTypes),
    AnswerKeyword: require("./AnswerKeyword")(sequelize, Sequelize.DataTypes),
    AnswerManager: require("./AnswerManager")(sequelize, Sequelize.DataTypes),
    BotScript: require("./BotScript")(sequelize, Sequelize.DataTypes),
    BotScriptButton: require("./BotScriptButton")(sequelize, Sequelize.DataTypes),
    Faq: require("./Faq")(sequelize, Sequelize.DataTypes),
    FaqButton: require("./FaqButton")(sequelize, Sequelize.DataTypes),
    FaqCategory: require("./FaqCategory")(sequelize, Sequelize.DataTypes),
    Keyword: require("./Keyword")(sequelize, Sequelize.DataTypes),
    ScriptButtons: require("./ScriptButtons")(sequelize, Sequelize.DataTypes),
    ScriptButtons: require("./ScriptButtons")(sequelize, Sequelize.DataTypes),
    TagModel: require("./TagModel")(sequelize, Sequelize.DataTypes),
    TagVoc: require("./TagVoc")(sequelize, Sequelize.DataTypes),
};

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
