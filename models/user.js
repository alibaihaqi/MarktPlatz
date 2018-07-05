'use strict';
module.exports = (sequelize, DataTypes) => {
  const Op = sequelize.Op;
  const bcrypt = require('bcrypt');

  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        is: { args: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, msg: 'Email format is incorrect'},
        isUnique: function(value, next) {
          User.findOne({
            where: {email : value,
            id: {
              [Op.ne] : this.id
            }}
          })
          .then(result => {
            if(result !== null) {
              return next("email already in use!")
            }
            else {
              return next();
            }
          })

          .catch(failed => {
            return next(`Error Message : ${failed}`)
          })
        }
      }
    },
    password: DataTypes.STRING,
    salt: DataTypes.INTEGER
  }, {
    }
  );

  User.beforeCreate((user, options) => {
    const saltRounds = 10;
    user.salt = bcrypt.genSaltSync(saltRounds);
    user.password = bcrypt.hashSync(user.password, user.salt);
  })

  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.Company, { through: models.Event});
    User.hasMany(models.Event)
  };

  User.prototype.getFullName = function () {
    return `${this.first_name} ${this.last_name}`;
  }

  User.prototype.getAge = function () {
    var ageDifMs = Date.now() - this.birthdate.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  User.prototype.hashPassword = function() {  
    this.password = bcrypt.hashSync(this.password, this.salt);
  }

  return User;
};