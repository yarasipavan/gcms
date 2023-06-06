"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Visitors_records extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Visitors_records.belongsTo(models.Security_guard, {
        foreignKey: { name: "authorized_by", allowNull: false },
      });
      Visitors_records.belongsTo(models.Occupants, {
        foreignKey: { name: "visiting_to" },
      });
    }
  }
  Visitors_records.init(
    {
      visitor_name: DataTypes.STRING,
      visitor_aadhar: DataTypes.BIGINT,
      visiting_to: { type: DataTypes.INTEGER },
      purpose: DataTypes.TEXT,
      visited_at: DataTypes.DATE,
      returned_at: DataTypes.DATE,
      authorized_by: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Visitors_records",
      timestamps: false,
    }
  );
  return Visitors_records;
};
