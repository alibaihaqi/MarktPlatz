const routes = require('express').Router();
const models = require('../models')

routes.get('/', (request, response) => {
  response.render('./static/homepage.ejs')
})

routes.get('/about_us', (request, response) => {
  response.render('./static/about_us.ejs')
})

routes.get('/list_companies', (request, response) => {
  models.Company.findAll({
    order : [["id", "ASC"]]
  })
    .then( companiesData => {
      // response.send(companiesData)
      response.render('./static/list_companies.ejs', { error : null, companies : companiesData });
    })
})

module.exports = routes