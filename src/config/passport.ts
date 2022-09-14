import {Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcryptjs'

// Load User model
import User from '../models/User'

export default function passportConfig(passport:any) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then((user:any) => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        // Match password
        bcrypt.compare(password, user.password, (err:any, isMatch:boolean) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user:any, done:any) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id:any, done:any) {
    User.findById(id, function(err:any, user:any) {
      done(err, user);
    });
  });
};
