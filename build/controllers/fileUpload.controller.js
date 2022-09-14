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
exports.uploadFile = void 0;
var file_1 = __importDefault(require("../models/file"));
var csv_1 = __importDefault(require("../models/csv"));
var fs_1 = __importDefault(require("fs"));
var uuid_1 = require("uuid");
var book_1 = __importDefault(require("../models/book"));
var csvParser_1 = __importDefault(require("../services/csvParser"));
var uploadFile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var isBook_1, fileExt, uid_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                isBook_1 = req.body.isBook;
                return [4 /*yield*/, req.file.filename.split(".").reverse()[0]];
            case 1:
                fileExt = _a.sent();
                if (!req.file) {
                    return [2 /*return*/, res.json({ error: "All fields are required" })];
                }
                else if (fileExt != "csv") {
                    fs_1.default.unlinkSync(req.file.path);
                    return [2 /*return*/, res.json({ file: "Please upload a \".csv\" file" })];
                }
                if (fileExt == "csv") {
                    uid_1 = (0, uuid_1.v4)();
                    (0, csvParser_1.default)(req.file.path)
                        .then(function (JSONdata) { return __awaiter(void 0, void 0, void 0, function () {
                        var bookArr_1, csv, file, response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (isBook_1) {
                                        bookArr_1 = [];
                                        JSONdata.forEach(function (e) {
                                            if (e.title && e.isbn) {
                                                var obj = {
                                                    userOwnerId: req.user._id,
                                                    path: req.file.path,
                                                    uuid: uid_1,
                                                    title: e.title || "",
                                                    isbn: e.isbn,
                                                    authors: e.author || "",
                                                    description: e.description || ""
                                                };
                                                bookArr_1.push(obj);
                                            }
                                        });
                                        if (bookArr_1.length > 0)
                                            book_1.default.insertMany(bookArr_1);
                                    }
                                    csv = new csv_1.default({
                                        filename: req.file.filename,
                                        data: JSONdata,
                                    });
                                    //saving csv file data into JSON format
                                    csv.save();
                                    file = new file_1.default({
                                        userOwnerId: req.user._id,
                                        userOwnerName: req.user.name,
                                        filename: req.file.filename,
                                        path: req.file.path,
                                        size: req.file.size,
                                        uuid: uid_1,
                                    });
                                    return [4 /*yield*/, file.save()];
                                case 1:
                                    response = _a.sent();
                                    res.json({ file: "".concat(process.env.APP_BASE_URL, "/files/").concat(response.uuid) });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log({ error: error_1 });
                return [2 /*return*/, res.send(error_1)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.uploadFile = uploadFile;
