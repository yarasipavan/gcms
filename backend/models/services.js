"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Services extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Services.belongsTo(models.Occupants, {
        foreignKey: { name: "occupant_id", allowNull: false },
      });
    }
  }
  Services.init(
    {
      occupant_id: { type: DataTypes.INTEGER, allowNull: false },
      swimming_poop_starts: DataTypes.DATE,
      swimming_pool_ends: DataTypes.DATE,
      parking_starts: DataTypes.DATE,
      parking_ends: DataTypes.DATE,
      house_keeping_starts: DataTypes.DATE,
      house_keeping_ends: DataTypes.DATE,
      gym_start: DataTypes.DATE,
      gym_ends: DataTypes.DATE,
      park_starts: DataTypes.DATE,
      park_ends: DataTypes.DATE,
      indoor_auditorium_starts: DataTypes.DATE,
      indoor_auditorium_ends: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Services",
      timestamps: false,
    }
  );
  return Services;
};
