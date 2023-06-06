"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Services", {
      fields: ["occupant_id"],
      type: "foreign key",
      name: "fk_Services_occupant_id",
      references: {
        table: "Occupants",
        field: "occupant_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Services",
      "fk_Services_occupant_id"
    );
  },
};
