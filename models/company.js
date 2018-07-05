'use strict';
module.exports = (sequelize, DataTypes) => {
  const Op = sequelize.Op;
  const bcrypt = require('bcrypt');

  var Company = sequelize.define('Company', {
    name: DataTypes.STRING,
    about_me: DataTypes.TEXT,
    category: DataTypes.STRING,
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        is: { args: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, msg: 'Email format is incorrect'},
        isUnique: function(value, next) {
          Company.findOne({
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
    salt: DataTypes.STRING
  }, {});

  Company.beforeCreate((company, options) => {
    const saltRounds = 10;
    company.salt = bcrypt.genSaltSync(saltRounds);
    company.password = bcrypt.hashSync(company.password, company.salt);
  })

  Company.associate = function(models) {
    // associations can be defined here
    Company.belongsToMany(models.User, { through: models.Event});
    Company.hasMany(models.Event)
  };
  return Company;
};