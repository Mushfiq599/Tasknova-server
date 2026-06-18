import express from 'express'
import {
    createWithdrawal, getWorkerWithdrawals,
    getPendingWithdrawals, approveWithdrawal,
} from '../controllers/withdrawalController.js'
import verifyToken from '../middleware/VerifyToken.js'
import { verifyAdmin } from '../middleware/VerifyRole.js'

const router = express.Router()

router.post('/', verifyToken, createWithdrawal)
router.get('/pending', verifyToken, verifyAdmin, getPendingWithdrawals)
router.get('/:email', verifyToken, getWorkerWithdrawals)
router.patch('/approve/:id', verifyToken, verifyAdmin, approveWithdrawal)

export default router