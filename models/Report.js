import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
    submission_id: { type: String, required: true },
    task_title: { type: String, required: true },
    worker_email: { type: String, required: true },
    worker_name: { type: String, required: true },
    buyer_email: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
    reported_at: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.model('Report', reportSchema)