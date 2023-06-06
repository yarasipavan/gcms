"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bills", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      block: {
        type: Sequelize.STRING,
      },
      flat_number: {
        type: Sequelize.INTEGER,
      },
      swimming_pool_bill: {
        type: Sequelize.INTEGER,
      },
      parking_bill: {
        type: Sequelize.INTEGER,
      },
      house_keeping_bill: {
        type: Sequelize.INTEGER,
      },
      gym_bill: {
        type: Sequelize.INTEGER,
      },
      park_bill: {
        type: Sequelize.INTEGER,
      },
      indoor_auditorium_bill: {
        type: Sequelize.INTEGER,
      },
      security_bill: {
        type: Sequelize.INTEGER,
      },
      maintenance_bill: {
        type: Sequelize.INTEGER,
      },
      gardening_bill: {
        type: Sequelize.INTEGER,
      },
      charity_bill: {
        type: Sequelize.INTEGER,
      },
      community_bill: {
        type: Sequelize.INTEGER,
      },
      total_bill: {
        type: Sequelize.INTEGER,
      },
      billed_date: {
        type: Sequelize.DATE,
      },
      bill_doc: {
        type: Sequelize.BLOB,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bills");
  },
};
