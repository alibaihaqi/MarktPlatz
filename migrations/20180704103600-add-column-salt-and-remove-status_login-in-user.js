'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn('Users', 'salt', {
      type : Sequelize.STRING
    })
      .then(() => {
        return queryInterface.removeColumn('Users', 'status_login')
      })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.addColumn('Users', 'status_login', {
      type : Sequelize.BOOLEAN
    })
      .then(() => {
        return queryInterface.removeColumn('Users', 'salt')
      })

  }
};
