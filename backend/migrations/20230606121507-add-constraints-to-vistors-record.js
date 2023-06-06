"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("visitors_records", {
      fields: ["visiting_to"],
      type: "foreign key",
      name: "fk_Visitors_visiting_to",
      references: {
        table: "occupants",
        field: "occupant_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("visitors_records", {
      fields: ["authorized_by"],
      type: "foreign key",
      name: "fk_Visitors_authorized_by",
      references: {
        table: "security_guard",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "visitors_records",
      "fk_Visitors_visiting_to"
    );
    await queryInterface.removeConstraint(
      "visitors_records",
      "fk_Visitors_authorized_by"
    );
  },
};
