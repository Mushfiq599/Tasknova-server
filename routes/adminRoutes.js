import express from 'express'
import { getAdminStats } from '../controllers/adminController.js'
import verifyToken from '../middleware/VerifyToken.js'
import { verifyAdmin } from '../middleware/VerifyRole.js'

const router = express.Router()

router.get('/stats', verifyToken, verifyAdmin, getAdminStats)

export default router