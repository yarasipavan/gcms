"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Services", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      occupant_id: {
        type: Sequelize.INTEGER,
      },
      swimming_pool_starts: {
        type: Sequelize.DATE,
      },
      swimming_pool_ends: {
        type: Sequelize.DATE,
      },
      parking_starts: {
        type: Sequelize.DATE,
      },
      parking_ends: {
        type: Sequelize.DATE,
      },
      house_keeping_starts: {
        type: Sequelize.DATE,
      },
      house_keeping_ends: {
        type: Sequelize.DATE,
      },
      gym_starts: {
        type: Sequelize.DATE,
      },
      gym_ends: {
        type: Sequelize.DATE,
      },
      park_starts: {
        type: Sequelize.DATE,
      },
      park_ends: {
        type: Sequelize.DATE,
      },
      indoor_auditorium_starts: {
        type: Sequelize.DATE,
      },
      indoor_auditorium_ends: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Services");
  },
};
