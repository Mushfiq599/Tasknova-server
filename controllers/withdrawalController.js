import Withdrawal from '../models/Withdrawal.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'

// POST /api/withdrawals
export const createWithdrawal = async (req, res) => {
    try {
        const { worker_email, withdrawal_coin } = req.body

        // Check worker has enough coins
        const worker = await User.findOne({ email: worker_email })
        if (!worker) return res.status(404).json({ message: 'Worker not found' })
        if (worker.coins < withdrawal_coin)
            return res.status(400).json({ message: 'Insufficient coins' })

        // Deduct coins immediately on request
        await User.findOneAndUpdate(
            { email: worker_email },
            { $inc: { coins: -withdrawal_coin } }
        )

        const withdrawal = await Withdrawal.create(req.body)
        res.status(201).json(withdrawal)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/withdrawals/:email — worker history
export const getWorkerWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({ worker_email: req.params.email })
            .sort({ withdraw_date: -1 })
        res.json(withdrawals)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/withdrawals/pending — admin sees all pending
export const getPendingWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({ status: 'pending' })
            .sort({ withdraw_date: -1 })
        res.json(withdrawals)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// PATCH /api/withdrawals/approve/:id
export const approveWithdrawal = async (req, res) => {
    try {
        const withdrawal = await Withdrawal.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        )
        if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' })

        // Notify worker
        await Notification.create({
            message: `Your withdrawal of $${withdrawal.withdrawal_amount} via ${withdrawal.payment_system} has been approved`,
            toEmail: withdrawal.worker_email,
            actionRoute: '/dashboard/withdrawals',
            time: new Date(),
        })

        res.json(withdrawal)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}