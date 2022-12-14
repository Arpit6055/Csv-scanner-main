"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBook = exports.readFile = exports.deleteFile = exports.downloadFile = void 0;
var file_1 = __importDefault(require("../models/file"));
var csv_1 = __importDefault(require("../models/csv"));
var fs_1 = __importDefault(require("fs"));
var book_1 = __importDefault(require("../models/book"));
var downloadFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var file, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, file_1.default.findOne({ uuid: req.params.uuid })];
            case 1:
                file = _a.sent();
                return [2 /*return*/, res.render('download', { uuid: file.uuid, fileName: file.filename, user: req.user.name, fileSize: file.size, downloadLink: "".concat(process.env.APP_BASE_URL, "/files/download/").concat(file.uuid) })];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, res.render('dashboard')];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.downloadFile = downloadFile;
var deleteFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var file, csv, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, file_1.default.findOne({ uuid: req.params.uuid })];
            case 1:
                file = _a.sent();
                return [4 /*yield*/, csv_1.default.findOne({ filename: file.filename })];
            case 2:
                csv = _a.sent();
                fs_1.default.unlinkSync(file.path);
                return [4 /*yield*/, file.remove()];
            case 3:
                _a.sent();
                return [4 /*yield*/, csv.remove()];
            case 4:
                _a.sent();
                console.log("successfully deleted ".concat(file.filename));
                res.redirect('/dashboard');
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                return [2 /*return*/, res.render('/dashboard')];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteFile = deleteFile;
var readFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var file, csv, data, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, file_1.default.findOne({ uuid: req.params.uuid })];
            case 1:
                file = _a.sent();
                return [4 /*yield*/, csv_1.default.findOne({ filename: file.filename })];
            case 2:
                csv = _a.sent();
                data = JSON.stringify(csv.data, null, 10);
                return [2 /*return*/, res.render('read', { data: data })];
            case 3:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.render('dashboard')];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.readFile = readFile;
var searchBook = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, isbn, query, bookData, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.query, email = _a.email, isbn = _a.isbn;
                console.log({ email: email, isbn: isbn });
                query = {};
                if (email)
                    query.authors = email;
                if (isbn)
                    query.isbn = isbn;
                if (!(email || isbn)) return [3 /*break*/, 2];
                return [4 /*yield*/, book_1.default.findOne(query)];
            case 1:
                bookData = _b.sent();
                return [2 /*return*/, res.json({ data: bookData })];
            case 2: return [2 /*return*/, res.json({ data: null })];
            case 3: return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.log(error_1);
                return [2 /*return*/, res.json({ data: null, error: error_1 })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.searchBook = searchBook;
