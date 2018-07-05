const routes = require('express').Router();
const models = require('../models')

routes.get('/', (request, response) => {
  response.render('./user/user-home.ejs')
})

routes.post('/', (request, response) => {
  console.log(request.body)

})

routes.get('/login', (request, response) => {
  response.render('./user/user-login.ejs')
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




module.exports = routes