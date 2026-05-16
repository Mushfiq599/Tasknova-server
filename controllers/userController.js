import User from '../models/User.js'

// POST /api/users — create or skip if exists
export const createUser = async (req, res) => {
    try {
        const { email, name, photoURL, role, coins } = req.body
        const exists = await User.findOne({ email })
        if (exists) return res.json({ message: 'User already exists', user: exists })

        const user = await User.create({
            email, name, photoURL,
            role: role || 'worker',
            coins: coins ?? (role === 'buyer' ? 50 : 10),
        })
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/users — all users (admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 })
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/users/role/:email
export const getUserRole = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email })
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json({ role: user.role })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/users/coins/:email
export const getUserCoins = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email })
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json({ coins: user.coins })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/users/top-workers
export const getTopWorkers = async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' })
            .sort({ coins: -1 })
            .limit(6)
            .select('name email photoURL coins')
        res.json(workers)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// PATCH /api/users/role/:id
export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            { new: true }
        )
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json(user)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({ message: 'User deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
