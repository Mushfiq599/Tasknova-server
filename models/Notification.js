import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    toEmail: { type: String, required: true },
    actionRoute: { type: String, default: '/dashboard' },
    time: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.model('Notification', notificationSchema)