"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("../../config/auth");
var express_1 = require("express");
var router = (0, express_1.Router)();
var fileUploadCont = __importStar(require("../../controllers/fileUpload.controller"));
var path_1 = __importDefault(require("path"));
var multer_1 = __importDefault(require("multer"));
//alocating storage
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) { return cb(null, 'src/uploads/'); },
    filename: function (req, file, cb) {
        var uniqueName = "".concat(path_1.default.parse(file.originalname).name).concat(Date.now() * Math.random()).concat(path_1.default.extname(file.originalname));
        cb(null, uniqueName);
    },
});
var upload = (0, multer_1.default)({ storage: storage, limits: { fileSize: 1000000 * 100 }, }).single('myfile');
router.post('/', auth_1.ensureAuthenticated, upload, fileUploadCont.uploadFile);
exports.default = router;
