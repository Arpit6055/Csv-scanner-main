"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var csvSchema = new Schema({
    filename: { type: String, required: true },
    data: { type: JSON, required: true }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Csv', csvSchema);
