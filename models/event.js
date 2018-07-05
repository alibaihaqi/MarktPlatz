'use strict';
module.exports = (sequelize, DataTypes) => {
  var Event = sequelize.define('Event', {
    UserId: DataTypes.STRING,
    CompanyId: DataTypes.STRING,
    date_min: DataTypes.DATE,
    date_max: DataTypes.DATE
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    Event.belongsTo(models.User);
    Event.belongsTo(models.Company)
  };
  return Event;
};