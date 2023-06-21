"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Credentials extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Credentials.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false },
      reset_token: { type: DataTypes.STRING },
      isfirstlogin: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
        allowNull: false,
      },
      passwordexpires: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: "Credentials",
      timestamps: false,
    }
  );
  return Credentials;
};
