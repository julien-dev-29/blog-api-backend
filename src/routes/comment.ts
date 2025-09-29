import { Router } from "express";
import commentController from '../controllers/comment.ts'
const router = Router()

router.get('/', commentController.getAll)
router.get('/:commentId', commentController.get)
router.post('/', commentController.create)
router.put('/:commentId', commentController.update)
router.delete('/:commentId', commentController.delete)

export default router