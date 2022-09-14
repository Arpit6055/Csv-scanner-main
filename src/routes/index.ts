import express from 'express';
import userRoute from './csv_app/user.routes';
import fileRoute from './csv_app/fileUpload.routes';
import fileReadRoute from './csv_app/showFile.routes';
import fileDwnldRoute from './csv_app/download.routes'
import indexRoute from './csv_app/basicIndex.routes'

const router = express.Router();

const allRoutes = [
    {
        path: '/',
        route: indexRoute,
    },
    {
        path: '/users/',
        route: userRoute,
    },
    {
        path: '/api/files/',
        route: fileRoute,
    },
    {
        path: '/files/',
        route: fileReadRoute,
    },
    {
        path: '/files/download/',
        route: fileDwnldRoute,
    }
];

allRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;