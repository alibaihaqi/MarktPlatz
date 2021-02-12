'use strict';
module.exports = (sequelize, DataTypes) => {
  var Company = sequelize.define('Company', {
    name: DataTypes.STRING,
    about_me: DataTypes.STRING,
    address: DataTypes.TEXT,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    category: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUnique: function(value, next){
          Company.findOne({where: {
            email: value,
            id : {
              [Op.ne] : this.id
            }
          }
        })
          .then(email => {
            if(email !== null && this.id !== email.id){
              console.log(this.id)
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
  }, {
      hooks: {
        beforeCreate: user => {
          Company.salt = bcrypt.genSaltSync(8);
          Company.password = bcrypt.hashSync(Company.password, Company.salt);
          },
        beforeUpdate: user =>{ 
          Company.password = bcrypt.hashSync(Company.password, Company.salt);
          }
      }

  });
  Company.associate = function(models) {
    // associations can be defined here
    Company.belongsToMany(models.User, {through: models.Event})
    Company.hasMany(models.Event)
  };
  return Company;
};