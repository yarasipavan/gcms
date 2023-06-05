"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Flats", {
      block: {
        type: Sequelize.STRING,
        allowNull: false,

        primaryKey: true,
      },
      flat_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      flat_status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      ownership: {
        type: Sequelize.STRING,
      },
      occupant_id: {
        type: Sequelize.INTEGER,
      },
      rent: {
        type: Sequelize.FLOAT,
        defaultValue: 25000,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Flats");
  },
};
