"use strict";
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var path = require('path');
var passport = require('passport');
var multer = require('multer');
//alocating storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) { return cb(null, 'uploads/profile_pic'); },
    filename: function (req, file, cb) {
        var uniqueName = "".concat(req.body.email).concat(path.extname(file.originalname));
        cb(null, uniqueName);
    },
});
var upload = multer({ storage: storage, limits: { fileSize: 1000000 * 100 }, }).single('profile_pic');
// Load User model
var User = require('../models/User');
var forwardAuthenticated = require('../config/auth').forwardAuthenticated;
// Login Page
router.get('/login', forwardAuthenticated, function (req, res) { return res.render('login'); });
// Register Page
router.get('/register', forwardAuthenticated, function (req, res) { return res.render('register'); });
// Register
router.post('/register', upload, function (req, res) {
    var profile_pic = req.file.fieldname;
    var _a = req.body, name = _a.name, email = _a.email, password = _a.password, password2 = _a.password2;
    var errors = [];
    if (!name || !email || !password || !password2 || !profile_pic) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        });
    }
    else {
        User.findOne({ email: email }).then(function (user) {
            if (user) {
                req.flash('error_msg', 'Email already exists');
                res.redirect('/users/register');
            }
            else {
                var newUser_1 = new User({
                    name: name,
                    email: email,
                    password: password,
                    profile_pic: req.file.filename
                });
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser_1.password, salt, function (err, hash) {
                        if (err)
                            throw err;
                        newUser_1.password = hash;
                        newUser_1
                            .save()
                            .then(function (user) {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/login');
                        })
                            .catch(function (err) { return console.log(err); });
                    });
                });
            }
        });
    }
});
// Login
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});
// Logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;
