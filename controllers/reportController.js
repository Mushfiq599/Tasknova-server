import Report from '../models/Report.js'
import User from '../models/User.js'

// POST /api/reports — buyer reports a submission
export const createReport = async (req, res) => {
    try {
        const report = await Report.create(req.body)
        res.status(201).json(report)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/reports — admin sees all reports
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ reported_at: -1 })
        res.json(reports)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// PATCH /api/reports/:id — admin resolves or dismisses
export const updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
        if (!report) return res.status(404).json({ message: 'Report not found' })

        // If resolved — ban the reported worker
        if (status === 'resolved') {
            await User.findOneAndUpdate(
                { email: report.worker_email },
                { role: 'worker' } // could extend to add a 'banned' field
            )
        }

        res.json(report)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}