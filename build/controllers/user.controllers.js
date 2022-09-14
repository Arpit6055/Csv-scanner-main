"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = exports.registerPage = exports.loginPage = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var passport_1 = __importDefault(require("passport"));
var User_1 = __importDefault(require("../models/User"));
var loginPage = function (req, res) { return res.render('login'); };
exports.loginPage = loginPage;
var registerPage = function (req, res) { return res.render('register'); };
exports.registerPage = registerPage;
var register = function (req, res) {
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
        User_1.default.findOne({ email: email }).then(function (user) {
            if (user) {
                req.flash('error_msg', 'Email already exists');
                res.redirect('/users/register');
            }
            else {
                var newUser_1 = new User_1.default({
                    name: name,
                    email: email,
                    password: password,
                    profile_pic: req.file.filename
                });
                bcryptjs_1.default.genSalt(10, function (err, salt) {
                    bcryptjs_1.default.hash(newUser_1.password, salt, function (err, hash) {
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
};
exports.register = register;
var login = function (req, res, next) {
    passport_1.default.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
};
exports.login = login;
var logout = function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
};
exports.logout = logout;
