'use strict';
const {
    Model,
    Sequelize,
    DataTypes
} = require('sequelize');


/**
 *
 * @param {Sequelize} sequelize
 * @returns {Post}
 */
module.exports = (sequelize) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Post.init({
        mediaId: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Post',
        tableName: "post"
    });

    return Post;
};