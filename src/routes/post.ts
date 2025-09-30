import { Router } from "express";
import postController from "../controllers/post";
import passport from "passport";
const router = Router()

router.get('/', postController.getAll)
router.get('/:postId', postController.get)
router.get('/:postId/comments', postController.getComments)
router.post('/', postController.create)
router.put('/:postId', postController.update)
router.delete('/:postId', postController.delete)

export default router