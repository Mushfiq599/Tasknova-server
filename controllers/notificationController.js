import Notification from '../models/Notification.js'

// GET /api/notifications/:email
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ toEmail: req.params.email })
            .sort({ time: -1 })
            .limit(20)
        res.json(notifications)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}