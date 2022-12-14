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
var express_1 = __importDefault(require("express"));
var express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
var passport_1 = __importDefault(require("passport"));
var connect_flash_1 = __importDefault(require("connect-flash"));
var session = require('express-session');
var index_1 = __importDefault(require("./routes/index"));
var passport_2 = __importDefault(require("./config/passport"));
var path_1 = __importDefault(require("path"));
var app = (0, express_1.default)();
var fs_1 = __importDefault(require("fs"));
// Passport Config
(0, passport_2.default)(passport_1.default);
// DB Config
var db_1 = require("./config/db");
(0, db_1.connectDB)();
// fs post build actions
var dirArr = ['./build/uploads', './build/uploads/profile_pic'];
dirArr.forEach(function (e) {
    if (!fs_1.default.existsSync(e)) {
        fs_1.default.mkdirSync(e);
    }
});
var cors = require('cors');
// Cors 
var corsOptions = {
    origin: (process.env.ALLOWED_CLIENTS || "").split(',')
    // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
};
app.use(cors(corsOptions));
// EJS
app.use(express_ejs_layouts_1.default);
app.set('views', path_1.default.join(__dirname, '/../src/views/'));
app.set('view engine', 'ejs');
app.use(express_1.default.static('src/public'));
app.use(express_1.default.static('build/uploads/profile_pic'));
app.use(express_1.default.static('build/uploads'));
// Express body parser
app.use(express_1.default.urlencoded({ extended: true }));
// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// Passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Connect flash
app.use((0, connect_flash_1.default)());
// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// Routes
app.use('/', index_1.default);
//error page
app.get("*", function (req, res) {
    res.redirect('/dashboard');
});
var PORT = process.env.PORT || 3000;
var server;
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            server = app.listen(PORT, function () {
                console.log("Connected successfully on port ".concat(PORT));
            });
        }
        catch (error) {
            console.error("Error occurred: ".concat(error.message));
        }
        return [2 /*return*/];
    });
}); };
startServer();
process.on('SIGTERM', function () {
    console.info('SIGTERM received');
    (0, db_1.disconnectDB)();
    if (server)
        server.close();
});
