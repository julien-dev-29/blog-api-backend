import prisma from '../../prisma/client.ts'
import { Request, Response } from 'express'
export default {
    getAll: async (req: Request, res: Response) => {
        try {
            const comments = await prisma.comment.findMany()
            if (!comments) {
                res.status(404).json({
                    message: "No comments"
                })
            } else {
                res.json(comments)
            }
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    get: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.commentId)
            const comment = await prisma.comment.findUnique({
                where: {
                    id: id
                }
            })
            if (!comment) {
                res.status(404).json({
                    message: "Comment not found"
                })
            } else {
                res.json(comment)
            }
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const { content, postId } = req.body
            if (!content || !postId) {
                return res.status(400).json({
                    message: "Content and postId are required"
                })
            }
            const newComment = await prisma.comment.create({
                data: {
                    content,
                    postId
                }
            })
            res.status(201).json({
                message: "Comment successfully created",
                comment: newComment
            })
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const commentId = Number(req.params.commentId)
            const deletedComment = await prisma.comment.delete({
                where: {
                    id: commentId
                }
            })
            res.json(deletedComment)
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const commentId = Number(req.params.commentId)
            const { content } = req.body
            if (!content) {
                return res.status(400).json({
                    message: "Content is required"
                })
            }
            const updatedComment = await prisma.comment.update({
                where: {
                    id: commentId
                },
                data: {
                    content
                }
            })
            res.json(updatedComment)
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    }
}