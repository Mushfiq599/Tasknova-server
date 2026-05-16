import User from '../models/User.js'

// Factory — returns middleware for a specific role
const verifyRole = (...roles) => async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email })
        if (!user || !roles.includes(user.role))
            return res.status(403).json({ message: 'Forbidden: insufficient role' })
        req.dbUser = user
        next()
    } catch {
        return res.status(500).json({ message: 'Role verification failed' })
    }
}

export const verifyAdmin = verifyRole('admin')
export const verifyBuyer = verifyRole('buyer', 'admin')
export const verifyWorker = verifyRole('worker', 'admin')

export default verifyRole