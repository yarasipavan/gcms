"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("visitors_records", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      visitor_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      visitor_aadhar: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      visiting_to: {
        type: Sequelize.INTEGER,
      },
      purpose: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      visited_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      returned_at: {
        type: Sequelize.DATE,
      },
      authorized_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("visitors_records");
  },
};
