import express from 'express'
import { logRequest, logResponse } from '../../middleware/logEndpoint.middleware.js'
import { userController } from './user.controller.js'

const router = express.Router()


router.get('/', logRequest, logResponse, userController.getUsers)
router.get('/:userId', logRequest, logResponse, userController.getUser)
router.delete('/:userId', logRequest, logResponse, userController.removeUser)
router.post('/', logRequest, logResponse, userController.addUser)
router.put('/', logRequest, logResponse, userController.updateUser)



export const userRoutes = router