import jwt from 'jsonwebtoken'

// POST /api/auth/jwt
export const generateToken = (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email required' })
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token })
}