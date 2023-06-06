"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Bills", {
      fields: ["block"],
      type: "foreign key",
      name: "fk__Bills__block",
      references: {
        table: "flats",
        field: "block",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("Bills", {
      fields: ["flat_number"],
      type: "foreign key",
      name: "fk__Bills__flat_number",
      references: {
        table: "flats",
        field: "flat_number",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("bills", "fk__Bills__block");
    await queryInterface.removeConstraint("bills", "fk__Bills__flat_number");
  },
};
