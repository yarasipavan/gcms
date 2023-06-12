"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("visitors_record", "block", {
      type: Sequelize.STRING,
      references: {
        model: "flats",
        key: "block",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.addColumn("visitors_record", "flat_number", {
      type: Sequelize.INTEGER,
      references: {
        model: "flats",
        key: "flat_number",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    await queryInterface.removeColumn("visitors_record", "visiting_to");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("visitors_record", "block");
    await queryInterface.removeColumn("visitors_record", "flat_number");
    await queryInterface.addColumn("visitors_record", "visiting_to", {
      type: Sequelize.STRING,
    });
  },
};
