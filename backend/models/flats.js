"use strict";
const { Model } = require("sequelize");
const services = require("./services");
module.exports = (sequelize, DataTypes) => {
  class Flats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Flats.belongsTo(models.Owners, { foreignKey: "owner_id" });
      Flats.belongsTo(models.Occupants, { foreignKey: "occupant_id" });
    }
  }
  Flats.init(
    {
      block: {
        type: DataTypes.STRING,
        allowNull: false,

        primaryKey: true,
      },
      flat_number: {
        type: DataTypes.INTEGER,
        allowNull: false,

        primaryKey: true,
      },
      owner_id: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
      flat_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      ownership: { type: DataTypes.STRING },
      occupant_id: { type: DataTypes.INTEGER },
      rent: { type: DataTypes.FLOAT, defaultValue: 25000 },
    },
    {
      sequelize,
      modelName: "Flats",
      timestamps: false,
      indexes: [
        {
          fields: ["flat_number"],
        },
      ],
    }
  );
  return Flats;
};
