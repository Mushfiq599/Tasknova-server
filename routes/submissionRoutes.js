import express from 'express'
import {
    createSubmission, getWorkerSubmissions,
    getApprovedSubmissions, getWorkerStats,
    getBuyerPendingSubmissions,
    approveSubmission, rejectSubmission,
} from '../controllers/submissionController.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, createSubmission)
router.get('/worker/:email', verifyToken, getWorkerSubmissions)
router.get('/approved/:email', verifyToken, getApprovedSubmissions)
router.get('/worker-stats/:email', verifyToken, getWorkerStats)
router.get('/buyer-pending/:email', verifyToken, getBuyerPendingSubmissions)
router.patch('/approve/:id', verifyToken, approveSubmission)
router.patch('/reject/:id', verifyToken, rejectSubmission)

export default router