"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Security_guard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Security_guard.hasMany(models.Vistors_record, {
        foreignKey: { name: "authorized_by", allowNull: false },
      });
    }
  }

  Security_guard.init(
    {
      email: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.BIGINT, allowNull: false },
    },
    {
      sequelize,
      modelName: "Security_guard",
      timestamps: false,
    }
  );
  return Security_guard;
};
