const { ensureAuthenticated } = require('../../config/auth');
import {Router} from 'express';
const router = Router();
import * as downloadRoutes from '../../controllers/downloads.controller'

router.get('/:uuid', ensureAuthenticated, downloadRoutes.downloadFile);

export default  router;