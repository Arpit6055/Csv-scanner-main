import path from 'path';
import multer from 'multer';
import { Router } from 'express';
const router = Router();
import { ensureAuthenticated, forwardAuthenticated } from '../../config/auth';
import * as userController from '../../controllers/user.controllers'
//alocating storage
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, '/../src/uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${path.parse(file.originalname).name}${Date.now() * Math.random()}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    },
});

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('profile_pic');

router.get('/login', forwardAuthenticated, userController.loginPage);
router.get('/register', forwardAuthenticated, userController.registerPage);
router.post('/register', upload, userController.register);
router.post('/login', userController.login);
router.get('/logout',ensureAuthenticated,userController.logout);

export default router;

