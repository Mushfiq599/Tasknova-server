import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    task_title: { type: String, required: true },
    task_detail: { type: String, required: true },
    required_workers: { type: Number, required: true },
    payable_amount: { type: Number, required: true },
    completion_date: { type: Date, required: true },
    submission_info: { type: String, required: true },
    task_image_url: { type: String, default: '' },
    Buyer_name: { type: String, required: true },
    Buyer_email: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
}, { timestamps: true })

export default mongoose.model('Task', taskSchema)