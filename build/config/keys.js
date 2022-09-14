"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var dbPassword = "".concat(process.env.MONGO_CONNECTION_URL);
exports.default = { mongoURI: dbPassword };
