"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint("Flats", {
      fields: ["owner_id"],
      type: "foreign key",
      name: "fk_Flats_ownerId",
      references: {
        table: "Owners",
        field: "owner_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("Flats", {
      fields: ["occupant_id"],
      type: "foreign key",
      name: "fk_Flats_occupantId",
      references: {
        table: "occupants",
        field: "occupant_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint("Flats", "fk_Flats_ownerId");
    await queryInterface.removeConstraint("Flats", "fk_Flats_occupantId");
  },
};
