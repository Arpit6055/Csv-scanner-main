import { ensureAuthenticated, forwardAuthenticated } from '../../config/auth';
import { Router } from 'express';
const router = Router();

import * as showFileCont from '../../controllers/showFile.controller'

router.get('/:uuid', ensureAuthenticated, showFileCont.downloadFile);
router.get('/read/:uuid', ensureAuthenticated,showFileCont.readFile);
router.get('/delete/:uuid', ensureAuthenticated,showFileCont.deleteFile);
router.get('/search/book/:text', ensureAuthenticated, showFileCont.searchBook);

export default router;
