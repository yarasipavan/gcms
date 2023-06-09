"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("service_charges", [
      {
        swimming_pool: 900,
        house_keeping: 1200,
        parking: 600,
        park: 900,
        gym: 1500,
        indoor_auditorium: 900,
        security: 1200,
        maintenance: 800,
        gardening: 300,
        charity: 200,
        community: 200,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("service_charges", null, {});
  },
};
