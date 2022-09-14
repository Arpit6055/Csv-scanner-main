"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_routes_1 = __importDefault(require("./csv_app/user.routes"));
var fileUpload_routes_1 = __importDefault(require("./csv_app/fileUpload.routes"));
var showFile_routes_1 = __importDefault(require("./csv_app/showFile.routes"));
var download_routes_1 = __importDefault(require("./csv_app/download.routes"));
var basicIndex_routes_1 = __importDefault(require("./csv_app/basicIndex.routes"));
var router = express_1.default.Router();
var allRoutes = [
    {
        path: '/',
        route: basicIndex_routes_1.default,
    },
    {
        path: '/users/',
        route: user_routes_1.default,
    },
    {
        path: '/api/files/',
        route: fileUpload_routes_1.default,
    },
    {
        path: '/files/',
        route: showFile_routes_1.default,
    },
    {
        path: '/files/download/',
        route: download_routes_1.default,
    }
];
allRoutes.forEach(function (route) {
    router.use(route.path, route.route);
});
exports.default = router;
