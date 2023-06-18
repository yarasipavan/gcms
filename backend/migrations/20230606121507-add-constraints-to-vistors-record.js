"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("visitors_record", {
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
      "visitors_record",
      "fk_Visitors_authorized_by"
    );
  },
};
