import express from 'express'
import { getNotifications } from '../controllers/notificationController.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

router.get('/:email', verifyToken, getNotifications)

export default router