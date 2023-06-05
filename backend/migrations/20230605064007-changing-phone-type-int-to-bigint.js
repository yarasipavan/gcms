"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("Owners", "phone", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("Occupants", "phone", {
      type: Sequelize.BIGINT,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("Owners", "phone", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.changeColumn("Occupants", "phone", {
      type: Sequelize.INTEGER,
    });
  },
};
