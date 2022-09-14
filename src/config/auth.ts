import { Request, Response, NextFunction } from 'express';

export function ensureAuthenticated(req:Request, res:Response, next:NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/users/login');
}

export function forwardAuthenticated(req:Request, res:Response, next:NextFunction) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/dashboard');      
}
