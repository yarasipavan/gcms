"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bills extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bills.belongsTo(models.Occupants, {
        foreignKey: { name: "occupant_id", allowNull: false },
      });
    }
  }
  Bills.init(
    {
      occupant_id: { type: DataTypes.INTEGER, allowNull: false },
      swimming_pool_bill: DataTypes.INTEGER,
      parking_bill: DataTypes.INTEGER,
      house_keeping_bill: DataTypes.INTEGER,
      gym_bill: DataTypes.INTEGER,
      park_bill: DataTypes.INTEGER,
      indoor_auditorium_bill: DataTypes.INTEGER,
      security_bill: DataTypes.INTEGER,
      maintenance_bill: DataTypes.INTEGER,
      gardening_bill: DataTypes.INTEGER,
      charity_bill: DataTypes.INTEGER,
      community_bill: DataTypes.INTEGER,
      rent_bill: DataTypes.INTEGER,
      total_bill: DataTypes.INTEGER,
      billed_date: DataTypes.DATE,
      bill_doc: DataTypes.BLOB,
    },
    {
      sequelize,
      modelName: "Bills",
      timestamps: false,
    }
  );
  return Bills;
};
