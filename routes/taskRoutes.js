import express from 'express'
import {
    createTask, getAllTasks, getAvailableTasks,
    getTaskById, getBuyerTasks, getBuyerStats,
    updateTask, deleteTask,
} from '../controllers/taskController.js'
import verifyToken from '../middleware/VerifyToken.js'
import { verifyAdmin , verifyBuyer } from '../middleware/VerifyRole.js'

const router = express.Router()

router.post('/', verifyToken, verifyBuyer, createTask)
router.get('/', verifyToken, verifyAdmin, getAllTasks)
router.get('/available', verifyToken, getAvailableTasks)
router.get('/buyer/:email', verifyToken, verifyBuyer, getBuyerTasks)
router.get('/buyer-stats/:email', verifyToken, verifyBuyer, getBuyerStats)
router.get('/:id', verifyToken, getTaskById)
router.patch('/:id', verifyToken, verifyBuyer, updateTask)
router.delete('/:id', verifyToken, deleteTask)

export default router