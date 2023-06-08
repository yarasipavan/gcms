"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Occupants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Occupants.hasOne(models.Flats, { foreignKey: { name: "occupant_id" } });
      Occupants.hasOne(models.Services, {
        foreignKey: { name: "occupant_id", allowNull: false },
      });
      Occupants.hasMany(models.Visitors_record, {
        foreignKey: { name: "visiting_to" },
      });
      Occupants.hasMany(models.Bills, {
        foreignKey: { name: "occupant_id", allowNull: false },
      });
    }
  }
  Occupants.init(
    {
      occupant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      occupant_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.BIGINT, allowNull: false },
      occupied_from: { type: DataTypes.DATE, allowNull: false },
      vacated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Occupants",
      timestamps: false,
    }
  );
  return Occupants;
};
