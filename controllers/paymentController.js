import Payment from '../models/Payment.js'
import User from '../models/User.js'

// POST /api/payments — save payment and add coins
export const createPayment = async (req, res) => {
    try {
        const { buyer_email, coins, amount } = req.body

        const payment = await Payment.create({ buyer_email, coins, amount })

        // Add coins to buyer
        await User.findOneAndUpdate(
            { email: buyer_email },
            { $inc: { coins } }
        )

        res.status(201).json(payment)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/payments/:email — buyer payment history
export const getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ buyer_email: req.params.email })
            .sort({ date: -1 })
        res.json(payments)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}