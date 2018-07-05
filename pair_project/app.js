'use strict'
const express = require('express')
let app = express()
let models = require('./models')
var bodyParser = require('body-parser')
var session = require('express-session')
var bcrypt = require('bcrypt');
let userRoute = require('./routes/user.js')


app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'rahasia',
  resave: false,
  saveUninitialized: true,
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view angine', 'ejs')

app.get('/', function(req,res){
    res.render('homepage.ejs')
})

app.get('/user/login', function(req,res){
    res.render('login_user.ejs',{message: '',  user: {email: '', password: ''}})
})

app.get('/user/logout',function(req,res){
    res.redirect('/')
})

app.use('/user', userRoute)




app.listen(3000)