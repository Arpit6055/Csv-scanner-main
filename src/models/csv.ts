import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const csvSchema = new Schema({
    filename: { type: String, required: true },
    data : {type:JSON, required:true}
}, { timestamps: true });

export default mongoose.model('Csv', csvSchema);