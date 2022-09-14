
import File from '../models/file';
import { Request, Response } from 'express';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export const renderWelcome = (req:Request, res:Response)=>{
    res.render('welcome')
}
export const renderdashboard = async (req:any, res:Response)=>{
    const file = await File.find({ userOwnerId: req.user._id });
    res.render('dashboard', {
      user: req.user,
      file,
    })
}

export const geteditUserInfoPage =async (req:any, res:Response)=>{
    res.render('editInfo', {user:req.user});
}

export const editInfo = async (req:any, res:Response)=>{
    try {
          var objForUpdate:any = {};
          if(req.body.name) objForUpdate.name =  req.body.name;
          if(req.body.email) objForUpdate.email = req.body.email;
          if(req.file){
            objForUpdate.profile_pic = req.file.filename;
            console.log(req.user.profile_pic);
            await fs.unlinkSync(`uploads/profile_pic/${req.user.profile_pic}`);
          } 
          if(req.body.password && req.body.password2) {
            if(req.body.password.length>6 && req.body.password==req.body.password2){
              objForUpdate.password = req.body.password;
              bcrypt.genSalt(10, async (err, salt)=>{
                  bcrypt.hash(objForUpdate.password, salt, async(err, hash)=>{
                    if(err) throw err;
                    objForUpdate.password =  hash;
                    console.log(objForUpdate.password);
                    const updateUser= await User.updateOne({email:req.user.email},objForUpdate);
                    return res.render('/dashboard');
                  })
              });
            } 
            
            
          }
          console.log(objForUpdate);
          const updateUser= await User.updateOne({email:req.user.email},objForUpdate);
          res.redirect('/dashboard')
      
    } catch (error) {
        console.log(error);
    }
  
  }







