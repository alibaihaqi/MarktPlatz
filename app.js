'use strict'

const express = require('express');
const app = express();
const session = require('express-session')

const indexRoutes = require('./routes/index');
const indexUsers = require('./routes/user');
const indexCompanies = require('./routes/company')

app.set('trust proxy', 1) // trust first proxy

app.use(session({

  secret: 'rahasia', // Buat buka data session kalian

  resave: false, 
  saveUninitialized: true,
  
}))

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : false }));

app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.use('/', indexRoutes);

app.use('/users', indexUsers)

app.use('/company', indexCompanies);


var server = app.listen(3000, () => {
  console.log(`Listening to port ${server.address().port}`)
})