const routes = require('express').Router();
const models = require('../models')

routes.get('/', (request, response) => {
  response.render('./company/company-home.ejs')
})

routes.get('/login', (request, response) => {
  response.render('./company/company-login.ejs')
})

routes.get('/register', (request, response) => {
  response.render('./company/company-signup.ejs', { error: null, dataUser: {} })
})

routes.post('/register', (request, response) => {
  // response.send(request.body)
  models.Company.create({
    name : request.body.company_name,
    about_me : request.body.about_me,
    category : request.body.category,
    address : request.body.address,
    city : request.body.city,
    province : request.body.province,
    email : request.body.email,
    password : request.body.password,
  })
    .then(() => {
      response.redirect('/company/login');
    })

    .catch(() => {
      let dataUser = {    
        name : request.body.company_name,
        about_me : request.body.about_me,
        category : request.body.category,
        address : request.body.address,
        city : request.body.city,
        province : request.body.province,
        email : request.body.email,
        password : request.body.password,
      }
      
      response.render('./company/company-signup.ejs', { error: null, dataUser: dataUser })
    })
})

module.exports = routes