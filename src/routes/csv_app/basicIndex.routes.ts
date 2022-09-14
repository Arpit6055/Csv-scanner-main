import { ensureAuthenticated, forwardAuthenticated } from '../../config/auth';
import path from 'path';
import {Router} from 'express';
const router = Router();
import * as indexController from '../../controllers/basicIndex.controllers'

import multer from 'multer';
//alocating storage
let storage = multer.diskStorage({
    destination: (req:any, file:any, cb:Function) => cb(null, '/../src/uploads/profile_pic') ,
    filename: (req:any, file:any, cb:Function) => {
        const uniqueName = `${req.user.email}${Math.random()*1}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    } ,
  });

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('profile_pic');

router.get('/', forwardAuthenticated, indexController.renderWelcome);
router.get('/dashboard', ensureAuthenticated,indexController.renderdashboard);
router.get("/editInfo", ensureAuthenticated, indexController.geteditUserInfoPage);
router.post("/editInfo",ensureAuthenticated,upload, indexController.editInfo);

export default router;