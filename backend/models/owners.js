"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Owners extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Owners.hasMany(models.Flats, { foreignKey: { name: "owner_id" } });
    }
  }
  Owners.init(
    {
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      sequelize,
      modelName: "Owners",
      timestamps: false,
    }
  );
  return Owners;
};
