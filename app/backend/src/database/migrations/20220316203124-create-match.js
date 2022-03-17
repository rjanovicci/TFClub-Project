'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matchs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      home_team: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      home_team_goals: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      away_team: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      away_team_goals: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      in_progress: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValues: 0,
      },
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('matchs');
  }
};
