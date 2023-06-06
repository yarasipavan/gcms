"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service_charges extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Service_charges.init(
    {
      swimming_pool: DataTypes.INTEGER,
      house_keeping: DataTypes.INTEGER,
      parking: DataTypes.INTEGER,
      park: DataTypes.INTEGER,
      gym: DataTypes.INTEGER,
      indoor_auditorium: DataTypes.INTEGER,
      security: DataTypes.INTEGER,
      maintenance: DataTypes.INTEGER,
      gardening: DataTypes.INTEGER,
      charity: DataTypes.INTEGER,
      community: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Service_charges",
      timestamps: false,
    }
  );
  return Service_charges;
};
