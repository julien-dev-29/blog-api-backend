import { Router } from "express";
import postController from "../controllers/post";
import passport from "passport";
const router = Router()

router.get('/', postController.getAll)
router.get('/:postId', postController.get)
router.get('/:postId/comments', postController.getComments)
router.post('/', passport.authenticate("jwt", { session: false }), postController.create)
router.put('/:postId', passport.authenticate("jwt", { session: false }), postController.update)
router.delete('/:postId', passport.authenticate("jwt", { session: false }), postController.delete)

export default router