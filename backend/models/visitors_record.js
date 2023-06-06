"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Visitors_record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Visitors_record.belongsTo(models.Security_guard, {
        foreignKey: { name: "authorized_by", allowNull: false },
      });
      Visitors_record.belongsTo(models.Occupants, {
        foreignKey: { name: "visiting_to" },
      });
    }
  }
  Visitors_record.init(
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
      modelName: "Visitors_record",
      timestamps: false,
    }
  );
  return Visitors_record;
};
