const express = require('express')
let router = express.Router()
let models = require('../models')
var bcrypt = require('bcrypt');



router.post('/login', function(req,res){
    models.User.findAll({where: {email: req.body.email}})
    .then(user => {
        if(user.length !==  0){
            let loginPass = bcrypt.hashSync(req.body.password, user[0].salt)
            if(user[0].password == loginPass){
                req.session.user = user
                res.redirect('/user')
            } else {
                res.render('login_user.ejs',{message: ' Password is wrong', user: {email: req.body.email, password: req.body.password}})
            }
        } else {
            res.render('login_user.ejs',{message: 'Email is not existed! Sign Up First', user: {email: req.body.email, password: req.body.password}})
        }
        
    })
    .catch(err =>{
        res.send(err.message)
    })
})

router.get('/', function(req,res,next){
    if(req.session.user){
        next()
    } else {
        res.redirect('/user/login')
    }
},function(req,res){
    res.render('user.ejs', {user: req.session.user[0]})
})

router.get('/edit-profile', function(req,res){
    res.render('edit_user.ejs', {message: '',user: req.session.user})
})

router.post('/edit-profile', function(req,res){
    models.User.update({
        id : req.session.user[0].id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birthdate: req.body.birthdate,
        address: req.body.address,
        city: req.body.city,
        province: req.body.province,
        email: req.body.email
    }, {where: {id: req.session.user[0].id}})
    .then(() => {
        let user = [{
            id: req.session.user[0].id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birthdate: req.body.birthdate,
            address: req.body.address,
            city: req.body.city,
            province: req.body.province,
            email: req.body.email,
            password: req.session.user[0].password,
            salt: req.session.user[0].salt}]
        req.session.user = user
        res.redirect('/user')
    })
    .catch(err => {
        let user = [{id: req.session.user[0].id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birthdate: req.body.birthdate,
            address: req.body.address,
            city: req.body.city,
            province: req.body.province,
            email: req.body.email}]
        res.render('edit_user.ejs', {message: err.message, user: user})
    })
})

router.get('/change-password', function(req,res){
    res.render('change_password.ejs', {message: '', user: {oldPass: '',newPass: '', RTNewPass: '', id: req.session.user[0].id}})
})

router.post('/change-password/:id', function(req,res){
    let pass = bcrypt.hashSync(req.body.oldPass, req.session.user[0].salt)
    if(pass === req.session.user[0].password){
        if(req.body.newPass === req.body.RTNewPass){
            let newPass = bcrypt.hashSync(req.body.newPass, req.session.user[0].salt)
            models.User.update({password: newPass}, {
                where: {id: req.params.id}
            })
            .then(() => {
                res.redirect('/user')
            })
        } else {
            res.render('change_password.ejs',{message: 'Type again your new password',user: {oldPass: req.body.oldPass,newPass: req.body.newPass, RTNewPass: req.body.RTNewPass, id: req.session.user[0].id}})
        }
    } else {
        res.render('change_password.ejs', {message: 'Please insert the right password', user: {oldPass: req.body.oldPass,newPass: req.body.newPass, RTNewPass: req.body.RTNewPass, id: req.session.user[0].id}})
    }
})

module.exports = router