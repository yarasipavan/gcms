"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Bills", {
      fields: ["occupant_id"],
      type: "foreign key",
      name: "fk_Bills_occupant_id",
      references: {
        table: "occupants",
        field: "occupant_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Bills", "fk_Bills_occupant_id");
  },
};
