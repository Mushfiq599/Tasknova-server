import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    buyer_email: { type: String, required: true },
    coins: { type: Number, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.model('Payment', paymentSchema)