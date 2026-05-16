import express from 'express'
import { createPayment, getPaymentHistory } from '../controllers/paymentController.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/',         verifyToken, createPayment)
router.get('/:email',    verifyToken, getPaymentHistory)

export default router