import { Router } from "express";
import categoryController from "../controllers/category";
import passport from "passport";
const router = Router()

router.get('/', categoryController.getPaginatedCategories)
router.get('/:categoryId', categoryController.get)
// router.get('/:postId/comments', categoryController.getComments)
router.post('/', passport.authenticate("jwt", { session: false }), categoryController.create)
router.put('/:categoryId', passport.authenticate("jwt", { session: false }), categoryController.update)
router.delete('/:categoryId', passport.authenticate("jwt", { session: false }), categoryController.delete)

export default router