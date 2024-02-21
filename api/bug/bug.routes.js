import express from 'express'
import { requireAuth } from '../../middleware/requireAuth.middleware.js'
import { logRequest, logResponse } from '../../middleware/logEndpoint.middleware.js'
import { bugController } from './bug.controller.js'

const router = express.Router()


router.get('/', logRequest, logResponse, bugController.getBugs)
router.get('/:bugId', logRequest, logResponse, bugController.getBug)
router.delete('/:bugId', logRequest, requireAuth, logResponse, bugController.removeBug)
router.post('/', logRequest, requireAuth, logResponse, bugController.addBug)
router.put('/', logRequest, requireAuth, logResponse, bugController.updateBug)



export const bugRoutes = router 