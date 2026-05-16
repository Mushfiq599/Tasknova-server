import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photoURL: { type: String, default: '' },
    role: { type: String, enum: ['worker', 'buyer', 'admin'], default: 'worker' },
    coins: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('User', userSchema)