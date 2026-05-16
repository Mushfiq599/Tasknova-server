import User from '../models/User.js'
import Payment from '../models/Payment.js'

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
    try {
        const [workers, buyers, allUsers, payments] = await Promise.all([
            User.countDocuments({ role: 'worker' }),
            User.countDocuments({ role: 'buyer' }),
            User.find().select('coins'),
            Payment.find().select('amount'),
        ])

        const totalCoins = allUsers.reduce((s, u) => s + u.coins, 0)
        const totalPayments = payments.reduce((s, p) => s + p.amount, 0)

        res.json({ workers, buyers, totalCoins, totalPayments })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}