const express = require('express')
let router = express.Router()
let models = require('../models')
var bcrypt = require('bcrypt');



router.post('/login', function(req,res){
    models.Company.findAll({where: {email: req.body.email}})
    .then(company => {
        if(company.length !==  0){
            let loginPass = bcrypt.hashSync(req.body.password, company[0].salt)
            if(company[0].password == loginPass){
                req.session.company = company
                res.redirect('/company')
            } else {
                res.render('login_company.ejs',{message: ' Password is wrong', company: {email: req.body.email, password: req.body.password}})
            }
        } else {
            res.render('login_company.ejs',{message: 'Email is not existed! Sign Up First', company: {email: req.body.email, password: req.body.password}})
        }
        
    })
    .catch(err =>{
        res.send(err.message)
    })
})

router.get('/', function(req,res,next){
    if(req.session.company){
        next()
    } else {
        res.redirect('/company/login')
    }
},function(req,res){
    res.render('company.ejs', {company: req.session.company[0]})
})

router.get('/edit-profile', function(req,res){
    res.render('edit_company.ejs', {message: '',company: req.session.company})
})

router.post('/edit-profile', function(req,res){
    models.User.update({
        id : req.session.company[0].id,
        name: req.body.name,
        about_me: req.body.about_me,
        address: req.body.address,
        city: req.body.city,
        province: req.body.province,
        category: req.body.category,
        email: req.body.email
    }, {where: {id: req.session.company[0].id}})
    .then(() => {
        let company = [{
            id : req.session.company[0].id,
            name: req.body.name,
            about_me: req.body.about_me,
            address: req.body.address,
            city: req.body.city,
            province: req.body.province,
            category: req.body.category,
            email: req.body.email,
            password: req.session.company[0].password,
            salt: req.session.company[0].salt}]
        req.session.company= company
        res.redirect('/company')
    })
    .catch(err => {
        let company= [{id : req.session.company[0].id,
            name: req.body.name,
            about_me: req.body.about_me,
            address: req.body.address,
            city: req.body.city,
            province: req.body.province,
            category: req.body.category,
            email: req.body.email}]
        res.render('edit_company.ejs', {message: err.message, company: company})
    })
})

router.get('/change-password', function(req,res){
    res.render('change_password_Company.ejs', {message: '', company: {oldPass: '',newPass: '', RTNewPass: '', id: req.session.company[0].id}})
})

router.post('/change-password/:id', function(req,res){
    let pass = bcrypt.hashSync(req.body.oldPass, req.session.company[0].salt)
    if(pass === req.session.company[0].password){
        if(req.body.newPass === req.body.RTNewPass){
            let newPass = bcrypt.hashSync(req.body.newPass, req.session.company[0].salt)
            models.Company.update({password: newPass}, {
                where: {id: req.params.id}
            })
            .then(() => {
                res.redirect('/company')
            })
        } else {
            res.render('change_password_Company.ejs',{message: 'Type again your new password',company: {oldPass: req.body.oldPass,newPass: req.body.newPass, RTNewPass: req.body.RTNewPass, id: req.session.company[0].id}})
        }
    } else {
        res.render('change_password_Company.ejs', {message: 'Please insert the right password', company: {oldPass: req.body.oldPass,newPass: req.body.newPass, RTNewPass: req.body.RTNewPass, id: req.session.company[0].id}})
    }
})

module.exports = router