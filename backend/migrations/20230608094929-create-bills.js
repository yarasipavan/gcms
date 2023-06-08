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
      occupant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      swimming_pool_bill: {
        type: Sequelize.FLOAT,
      },
      parking_bill: {
        type: Sequelize.FLOAT,
      },
      house_keeping_bill: {
        type: Sequelize.FLOAT,
      },
      gym_bill: {
        type: Sequelize.FLOAT,
      },
      park_bill: {
        type: Sequelize.FLOAT,
      },
      indoor_auditorium_bill: {
        type: Sequelize.FLOAT,
      },
      security_bill: {
        type: Sequelize.FLOAT,
      },
      maintenance_bill: {
        type: Sequelize.FLOAT,
      },
      gardening_bill: {
        type: Sequelize.FLOAT,
      },
      charity_bill: {
        type: Sequelize.FLOAT,
      },
      community_bill: {
        type: Sequelize.FLOAT,
      },
      total_bill: {
        type: Sequelize.FLOAT,
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
