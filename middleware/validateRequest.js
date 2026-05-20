// Validates required fields in request body
export const validateBody = (fields) => (req, res, next) => {
    const missing = fields.filter(f => !req.body[f])
    if (missing.length > 0) {
        return res.status(400).json({
            message: `Missing required fields: ${missing.join(', ')}`,
        })
    }
    next()
}

// Validates task creation body
export const validateTask = (req, res, next) => {
    const { task_title, task_detail, required_workers, payable_amount, completion_date, submission_info } = req.body
    const errors = []

    if (!task_title?.trim()) errors.push('task_title is required')
    if (!task_detail?.trim()) errors.push('task_detail is required')
    if (!required_workers || required_workers < 1) errors.push('required_workers must be at least 1')
    if (!payable_amount || payable_amount < 1) errors.push('payable_amount must be at least 1')
    if (!completion_date) errors.push('completion_date is required')
    if (!submission_info?.trim()) errors.push('submission_info is required')

    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors })
    next()
}

// Validates submission body
export const validateSubmission = (req, res, next) => {
    const { task_id, worker_email, submission_details } = req.body
    const errors = []

    if (!task_id) errors.push('task_id is required')
    if (!worker_email) errors.push('worker_email is required')
    if (!submission_details?.trim()) errors.push('submission_details is required')

    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors })
    next()
}

// Validates withdrawal body
export const validateWithdrawal = (req, res, next) => {
    const { withdrawal_coin, payment_system, account_number } = req.body
    const errors = []

    if (!withdrawal_coin || withdrawal_coin < 200) errors.push('Minimum withdrawal is 200 coins')
    if (!payment_system) errors.push('payment_system is required')
    if (!account_number) errors.push('account_number is required')

    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors })
    next()
}