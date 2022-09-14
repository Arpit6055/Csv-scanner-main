import bcrypt from 'bcryptjs'
import passport from 'passport'
import User from '../models/User'
import { Request, Response, NextFunction } from "express";

export const loginPage = (req: Request, res: Response) => res.render('login');

export const registerPage = (req: Request, res: Response) => res.render('register');

export const register = (req: any, res: Response) => {
    const profile_pic = req.file.fieldname;

    const { name, email, password, password2 } = req.body;

    let errors = [];

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
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email }).then((user: any) => {
            if (user) {
                req.flash(
                    'error_msg',
                    'Email already exists'
                );
                res.redirect('/users/register');
            } else {
                const newUser: any = new User({
                    name,
                    email,
                    password,
                    profile_pic: req.file.filename
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user: any) => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/login');
                            })
                            .catch((err: Error) => console.log(err));
                    });
                });
            }
        });
    }
};


export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
}


export const logout = (req: any, res: Response) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
}





