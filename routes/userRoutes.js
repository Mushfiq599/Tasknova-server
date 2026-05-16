import express from 'express'
import {
    createUser, getAllUsers, getUserRole,
    getUserCoins, getTopWorkers,
    updateUserRole, deleteUser,
} from '../controllers/userController.js'
import verifyToken from '../middleware/verifyToken.js'
import { verifyAdmin } from '../middleware/verifyRole.js'

const router = express.Router()

router.post('/', createUser)
router.get('/', verifyToken, verifyAdmin, getAllUsers)
router.get('/top-workers', getTopWorkers)
router.get('/role/:email', getUserRole)
router.get('/coins/:email', verifyToken, getUserCoins)
router.patch('/role/:id', verifyToken, verifyAdmin, updateUserRole)
router.delete('/:id', verifyToken, verifyAdmin, deleteUser)

export default router