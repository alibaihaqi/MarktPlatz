const routes = require('express').Router();
const models = require('../models')
const bcrypt = require('bcrypt');

routes.get('/login', (request, response) => {
  response.render('./company/company-login.ejs',{message: '',  company: {email: '', password: ''}})
})

routes.post('/login', (request,response) => {
  models.Company.findAll({where: {email: request.body.email}})
  .then(company => {
      if(company.length !==  0){
          let loginPass = bcrypt.hashSync(request.body.password, company[0].salt)
          if(company[0].password == loginPass){
              request.session.company = company
              response.redirect('/company')
          } else {
              response.render('./company/company-login.ejs',{message: ' Password is wrong', company: {email: request.body.email, password: request.body.password}})
          }
      } else {
          response.render('./company/company-login.ejs',{message: 'Email is not existed! Sign Up First', company: {email: request.body.email, password: request.body.password}})
      }
      
  })
  .catch(err =>{
      response.send(err.message)
  })
})

routes.get('/', (request, response, next) => {
  if(request.session.company){
      next()
  } else {
      response.redirect('/company/login')
  }
}, (request,response) => {
  response.render('./company/company-home.ejs', {company: request.session.company[0]})
})

routes.get('/', (request, response) => {
  response.render('./company/company-home.ejs')
})

routes.get('/edit-profile', function(response, response){
   response.render('edit_company.ejs', {message: '',company: response.session.company})
})

routes.post('/edit-profile', function(response, response){
  models.User.update({
      id : response.session.company[0].id,
      name: response.body.name,
      about_me: response.body.about_me,
      address: response.body.address,
      city: response.body.city,
      province: response.body.province,
      category: response.body.category,
      email: response.body.email
  }, {where: {id: response.session.company[0].id}})
  .then(() => {
      let company = [{
          id : response.session.company[0].id,
          name: response.body.name,
          about_me: response.body.about_me,
          address: response.body.address,
          city: response.body.city,
          province: response.body.province,
          category: response.body.category,
          email: response.body.email,
          password: response.session.company[0].password,
          salt: response.session.company[0].salt}]
      response.session.company= company
       response.redirect('/company')
  })
  .catch(err => {
      let company= [{id : response.session.company[0].id,
          name: response.body.name,
          about_me: response.body.about_me,
          address: response.body.address,
          city: response.body.city,
          province: response.body.province,
          category: response.body.category,
          email: response.body.email}]
       response.render('edit_company.ejs', {message: err.message, company: company})
  })
})

routes.get('/change-password', function(response, response){
   response.render('change_password_Company.ejs', {message: '', company: {oldPass: '',newPass: '', RTNewPass: '', id: response.session.company[0].id}})
})

routes.post('/change-password/:id', function(response, response){
  let pass = bcrypt.hashSync(response.body.oldPass, response.session.company[0].salt)
  if(pass === response.session.company[0].password){
      if(response.body.newPass === response.body.RTNewPass){
          let newPass = bcrypt.hashSync(response.body.newPass, response.session.company[0].salt)
          models.Company.update({password: newPass}, {
              where: {id: response.params.id}
          })
          .then(() => {
               response.redirect('/company')
          })
      } else {
           response.render('change_password_Company.ejs',{message: 'Type again your new password',company: {oldPass: response.body.oldPass,newPass: response.body.newPass, RTNewPass: response.body.RTNewPass, id: response.session.company[0].id}})
      }
  } else {
       response.render('change_password_Company.ejs', {message: 'Please insert the right password', company: {oldPass: response.body.oldPass,newPass: response.body.newPass, RTNewPass: response.body.RTNewPass, id: response.session.company[0].id}})
  }
})

routes.get('/register', (request, response) => {
  response.render('./company/company-signup.ejs', { error: null, dataUser: {} })
})

routes.post('/register', (request, response) => {
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

routes.get('/logout', (request, response) => {
  response.redirect('/')
})
module.exports = routes