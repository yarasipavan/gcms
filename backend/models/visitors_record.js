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
      visitor_name: { type: DataTypes.STRING, allowNull: false },
      visitor_aadhar: { type: DataTypes.BIGINT, allowNull: false },
      visiting_to: { type: DataTypes.INTEGER },
      purpose: { type: DataTypes.TEXT, allowNull: false },
      visited_at: { type: DataTypes.DATE, allowNull: false },
      returned_at: DataTypes.DATE,
      authorized_by: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Visitors_record",
      timestamps: false,
      freezeTableName: true,
    }
  );
  return Visitors_record;
};
