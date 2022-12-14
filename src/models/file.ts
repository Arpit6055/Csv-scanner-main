import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    userOwnerId: { type: String, required: true },
    userOwnerName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('File', fileSchema);