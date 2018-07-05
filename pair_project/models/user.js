'use strict';
module.exports = (sequelize, DataTypes) => {
  const Op = sequelize.Op;
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    email:  {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUnique: function(value, next){
          User.findOne({where: {
            email: value,
            id : {
              [Op.ne] : this.id
            }
          }
        })
          .then(email => {
            if(email !== null){
              return next('email is already used here')
            } else {
              next()
            }
          })
        },
        isEmail: {
          args: true,
          msg: 'email is not valid'
        }}
},
    password: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here

    User.belongsToMany(models.Company,{through: models.Event})
    User.hasMany(models.Event)
  };

  User.prototype.getFullName = function(){
    return `${this.first_name} ${this.last_name}`
  }
  return User;
};