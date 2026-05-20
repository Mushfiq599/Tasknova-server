import Task from '../models/Task.js'
import User from '../models/User.js'

// POST /api/tasks
export const createTask = async (req, res) => {
    try {
        const { Buyer_email, required_workers, payable_amount } = req.body
        const totalCost = required_workers * payable_amount

        // Deduct coins from buyer
        const buyer = await User.findOne({ email: Buyer_email })
        if (!buyer) return res.status(404).json({ message: 'Buyer not found' })
        if (buyer.coins < totalCost)
            return res.status(400).json({ message: 'Not enough coins' })

        await User.findOneAndUpdate(
            { email: Buyer_email },
            { $inc: { coins: -totalCost } }
        )

        const task = await Task.create(req.body)
        res.status(201).json(task)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/tasks — all tasks (admin)
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ completion_date: -1 })
        res.json(tasks)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/tasks/available — with search, filter & sort
export const getAvailableTasks = async (req, res) => {
    try {
        const { search, minPay, maxPay, sortBy = 'createdAt' } = req.query
        const query = { required_workers: { $gt: 0 } }

        if (search) {
            query.$or = [
                { task_title: { $regex: search, $options: 'i' } },
                { Buyer_name: { $regex: search, $options: 'i' } },
            ]
        }
        if (minPay) query.payable_amount = { ...query.payable_amount, $gte: Number(minPay) }
        if (maxPay) query.payable_amount = { ...query.payable_amount, $lte: Number(maxPay) }

        const sortMap = {
            createdAt: { createdAt: -1 },
            payable_amount: { payable_amount: -1 },
            deadline: { completion_date: 1 },
        }
        const sort = sortMap[sortBy] || sortMap.createdAt

        const tasks = await Task.find(query).sort(sort)
        res.json(tasks)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/tasks/:id
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).json({ message: 'Task not found' })
        res.json(task)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/tasks/buyer/:email
export const getBuyerTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ Buyer_email: req.params.email })
            .sort({ completion_date: -1 })
        res.json(tasks)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/tasks/buyer-stats/:email
export const getBuyerStats = async (req, res) => {
    try {
        const tasks = await Task.find({ Buyer_email: req.params.email })
        const taskCount = tasks.length
        const pendingWorkers = tasks.reduce((s, t) => s + t.required_workers, 0)
        const totalPaid = tasks.reduce((s, t) => s + (t.payable_amount * 0), 0)
        res.json({ taskCount, pendingWorkers, totalPaid })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// PATCH /api/tasks/:id
export const updateTask = async (req, res) => {
    try {
        const { task_title, task_detail, submission_info } = req.body
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { task_title, task_detail, submission_info },
            { new: true }
        )
        if (!task) return res.status(404).json({ message: 'Task not found' })
        res.json(task)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).json({ message: 'Task not found' })

        // Refund remaining coins to buyer
        const refund = task.required_workers * task.payable_amount
        if (refund > 0) {
            await User.findOneAndUpdate(
                { email: task.Buyer_email },
                { $inc: { coins: refund } }
            )
        }

        await Task.findByIdAndDelete(req.params.id)
        res.json({ message: 'Task deleted and coins refunded', refund })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}