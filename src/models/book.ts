import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    userOwnerId: { type: String, required: true },
    path: { type: String, required: true },
    uuid: { type: String, required: true },
    title : { type: String, required: true },
    isbn : { type: String, required: true },
    authors : { type: String, required: false },
    description : { type: String, required: false },
}, { timestamps: true });

export default mongoose.model('Book', bookSchema);