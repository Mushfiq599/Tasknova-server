import Submission from '../models/Submission.js'
import Task from '../models/Task.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'

// POST /api/submissions
export const createSubmission = async (req, res) => {
    try {
        const submission = await Submission.create(req.body)

        // Decrease required_workers by 1
        await Task.findByIdAndUpdate(req.body.task_id, {
            $inc: { required_workers: -1 }
        })

        // Notify buyer that a worker submitted
        await Notification.create({
            message: `${req.body.worker_name} submitted work for "${req.body.task_title}"`,
            toEmail: req.body.Buyer_email,
            actionRoute: '/dashboard/buyer-home',
            time: new Date(),
        })

        res.status(201).json(submission)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/submissions/worker/:email?page=1&limit=10
export const getWorkerSubmissions = async (req, res) => {
    try {
        const { email } = req.params
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const [submissions, total] = await Promise.all([
            Submission.find({ worker_email: email })
                .sort({ current_date: -1 })
                .skip(skip)
                .limit(limit),
            Submission.countDocuments({ worker_email: email }),
        ])

        res.json({ submissions, total })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/submissions/approved/:email
export const getApprovedSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            worker_email: req.params.email,
            status: 'approved',
        }).sort({ current_date: -1 })
        res.json(submissions)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/submissions/worker-stats/:email
export const getWorkerStats = async (req, res) => {
    try {
        const { email } = req.params
        const all = await Submission.find({ worker_email: email })
        const total = all.length
        const pending = all.filter(s => s.status === 'pending').length
        const earning = all
            .filter(s => s.status === 'approved')
            .reduce((sum, s) => sum + s.payable_amount, 0)
        res.json({ total, pending, earning })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/submissions/buyer-pending/:email
export const getBuyerPendingSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            Buyer_email: req.params.email,
            status: 'pending',
        }).sort({ current_date: -1 })
        res.json(submissions)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// PATCH /api/submissions/approve/:id
export const approveSubmission = async (req, res) => {
    try {
        const { worker_email, payable_amount } = req.body

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        )

        // Add coins to worker
        await User.findOneAndUpdate(
            { email: worker_email },
            { $inc: { coins: payable_amount } }
        )

        // Notify worker
        await Notification.create({
            message: `You earned ${payable_amount} coins from ${submission.Buyer_name} for completing "${submission.task_title}"`,
            toEmail: worker_email,
            actionRoute: '/dashboard/worker-home',
            time: new Date(),
        })

        res.json(submission)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// PATCH /api/submissions/reject/:id
export const rejectSubmission = async (req, res) => {
    try {
        const { task_id } = req.body

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        )

        // Restore required_workers by 1
        await Task.findByIdAndUpdate(task_id, {
            $inc: { required_workers: 1 }
        })

        // Notify worker
        await Notification.create({
            message: `Your submission for "${submission.task_title}" was rejected by ${submission.Buyer_name}`,
            toEmail: submission.worker_email,
            actionRoute: '/dashboard/my-submissions',
            time: new Date(),
        })

        res.json(submission)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}