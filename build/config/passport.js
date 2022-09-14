"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_local_1 = require("passport-local");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
// Load User model
var User_1 = __importDefault(require("../models/User"));
function passportConfig(passport) {
    passport.use(new passport_local_1.Strategy({ usernameField: 'email' }, function (email, password, done) {
        // Match user
        User_1.default.findOne({
            email: email
        }).then(function (user) {
            if (!user) {
                return done(null, false, { message: 'That email is not registered' });
            }
            // Match password
            bcryptjs_1.default.compare(password, user.password, function (err, isMatch) {
                if (err)
                    throw err;
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            });
        });
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User_1.default.findById(id, function (err, user) {
            done(err, user);
        });
    });
}
exports.default = passportConfig;
;
