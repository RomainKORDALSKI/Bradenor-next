"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log("Executing migration: add reset password fields to users");
    await queryInterface.addColumn("Users", "resetPasswordToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Users", "resetPasswordExpires", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "resetPasswordToken");
    await queryInterface.removeColumn("Users", "resetPasswordExpires");
  },
};
