import { ensureAuthenticated, forwardAuthenticated } from '../../config/auth';
import { Router } from 'express';
const router = Router();
import * as fileUploadCont from '../../controllers/fileUpload.controller'

import path from 'path';
import multer from 'multer';
//alocating storage
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'src/uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${path.parse(file.originalname).name}${Date.now() * Math.random()}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    },
});

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile');

router.post('/', ensureAuthenticated, upload, fileUploadCont.uploadFile);

export default router;