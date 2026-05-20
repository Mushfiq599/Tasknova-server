import express from 'express'
import { createReport, getAllReports, updateReportStatus } from '../controllers/reportController.js'
import verifyToken from '../middleware/verifyToken.js'
import { verifyAdmin, verifyBuyer } from '../middleware/verifyRole.js'

const router = express.Router()

router.post('/',          verifyToken, verifyBuyer, createReport)
router.get('/',           verifyToken, verifyAdmin, getAllReports)
router.patch('/:id',      verifyToken, verifyAdmin, updateReportStatus)

export default router