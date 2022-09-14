"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var bookSchema = new Schema({
    userOwnerId: { type: String, required: true },
    path: { type: String, required: true },
    uuid: { type: String, required: true },
    title: { type: String, required: true },
    isbn: { type: String, required: true },
    authors: { type: String, required: false },
    description: { type: String, required: false },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Book', bookSchema);
