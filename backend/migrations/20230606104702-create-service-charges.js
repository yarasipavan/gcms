"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Service_charges", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      swimming_pool: {
        type: Sequelize.INTEGER,
      },
      house_keeping: {
        type: Sequelize.INTEGER,
      },
      parking: {
        type: Sequelize.INTEGER,
      },
      park: {
        type: Sequelize.INTEGER,
      },
      gym: {
        type: Sequelize.INTEGER,
      },
      indoor_auditorium: {
        type: Sequelize.INTEGER,
      },
      security: {
        type: Sequelize.INTEGER,
      },
      maintenance: {
        type: Sequelize.INTEGER,
      },
      gardening: {
        type: Sequelize.INTEGER,
      },
      charity: {
        type: Sequelize.INTEGER,
      },
      community: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Service_charges");
  },
};
