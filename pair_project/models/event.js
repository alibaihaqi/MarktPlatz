'use strict';
module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    UserId: DataTypes.INTEGER,
    CompanyId: DataTypes.INTEGER,
    dateMin: DataTypes.DATEONLY,
    dateMax: DataTypes.DATEONLY
  }, {});
  Event.associate = function(models) {
    // associations can be defined here

    Event.belongsTo(models.Company)
    Event.belongsTo(models.User)
  };
  return Event;
};