"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("credentials", "isfirstlogin", {
      type: Sequelize.BOOLEAN,
      defaultValue: 1,
      allowNull: false,
    });
    await queryInterface.addColumn("credentials", "passwordexpires", {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("credentials", "isfirstlogin");
    await queryInterface.removeColumn("credentials", "passwordexpires");
  },
};
