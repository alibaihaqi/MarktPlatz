const routes = require('express').Router();
const models = require('../models')

const bcrypt = require('bcrypt');


routes.get('/login', (request, response) => {
  response.render('./user/user-login.ejs', {message: '',  user: {email: '', password: ''} })
})

routes.post('/login', (request, response) => {
  models.User.findAll({
    where: {
      email: request.body.email
    }
  })
  .then(user => {
      if(user.length !==  0){
          let loginPass = bcrypt.hashSync(request.body.password, user[0].salt)
          if(user[0].password == loginPass){
              request.session.user = user
              response.redirect('/users')
          } else {
              response.render('./user/user-login.ejs',{message: ' Password is wrong', user: {email: request.body.email, password: request.body.password}})
          }
      } else {
          response.render('./user/user-login.ejs',{message: 'Email is not existed! Sign Up First', user: {email: request.body.email, password: request.body.password}})
      }
      
  })
  .catch(err =>{
      response.send(err.message)
  })
})

routes.get('/', (request, response, next) => {
  if(request.session.user){
      next()
  } else {
      response.redirect('/users/login')
  }
}, (request, response) => {
  response.render('./user/user-home.ejs', {user: request.session.user[0]})
})

routes.get('/edit-profile', (request, response) => {
  response.render('./user/user-edit-profile.ejs', {message: '',user: request.session.user})
})

routes.post('/edit-profile', (request, response) => {
  models.User.update({
      id : request.session.user[0].id,
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      birthdate: request.body.birthdate,
      address: request.body.address,
      city: request.body.city,
      province: request.body.province,
      email: request.body.email
  }, {where: {id: request.session.user[0].id}})
  .then(() => {
      let user = [{
          id: request.session.user[0].id,
          first_name: request.body.first_name,
          last_name: request.body.last_name,
          birthdate: request.body.birthdate,
          address: request.body.address,
          city: request.body.city,
          province: request.body.province,
          email: request.body.email,
          password: request.session.user[0].password,
          salt: request.session.user[0].salt}]
      request.session.user = user
      response.redirect('/users')
  })
  .catch(err => {
      let user = [{id: request.session.user[0].id,
          first_name: request.body.first_name,
          last_name: request.body.last_name,
          birthdate: request.body.birthdate,
          address: request.body.address,
          city: request.body.city,
          province: request.body.province,
          email: request.body.email}]
      response.render('./user/user-edit-profile.ejs', {message: err.message, user: user})
  })
})

routes.get('/change-password', function(request,response){
  response.render('./user/user-change-password.ejs', {message: '', user: {oldPass: '',newPass: '', RTNewPass: '', id: request.session.user[0].id}})
})

routes.post('/change-password/:id', function(request,response){
  let pass = bcrypt.hashSync(request.body.oldPass, request.session.user[0].salt)
  if(pass === request.session.user[0].password){
      if(request.body.newPass === request.body.RTNewPass){
          let newPass = bcrypt.hashSync(request.body.newPass, request.session.user[0].salt)
          models.User.update({password: newPass}, {
              where: {id: request.params.id}
          })
          .then(() => {
              response.redirect('/users')
          })
      } else {
          response.render('./user/user-change-password.ejs',{message: 'Type again your new password',user: {oldPass: request.body.oldPass,newPass: request.body.newPass, RTNewPass: request.body.RTNewPass, id: request.session.user[0].id}})
      }
  } else {
      response.render('./user/user-change-password.ejs', {message: 'Please insert the right password', user: {oldPass: request.body.oldPass,newPass: request.body.newPass, RTNewPass: request.body.RTNewPass, id: request.session.user[0].id}})
  }
})

routes.get('/logout', (request,response) => {
  response.redirect('/users')

})

routes.get('/register', (request, response) => {
  response.render('./user/user-signup.ejs', { error: null, dataUser: {} })
})

routes.post('/register', (request, response) => {
  models.User.create({
    first_name : request.body.first_name,
    last_name : request.body.last_name,
    birthdate : request.body.birthdate,
    address : request.body.address,
    city : request.body.city,
    province : request.body.province,
    email : request.body.email,
    password : request.body.password,
  })
    .then(() => {
      response.redirect('/user/login');
    })

    .catch(() => {
      let dataUser = {
        first_name : request.body.first_name,
        last_name : request.body.last_name,
        birthdate : request.body.birthdate,
        address : request.body.address,
        city : request.body.city,
        province : request.body.province,
        email : request.body.email,
        password : request.body.password,
      }
      response.render('./user/user-signup.ejs', { error: null, dataUser: dataUser })
    })
})


routes.get('/logout', (request, response) => {
  response.redirect('/')
})





module.exports = routes