import { Request, Response } from "express";
import prisma from '../../prisma/client.ts'
export default {
    getAll: async (req: Request, res: Response) => {
        try {
            const posts = await prisma.post.findMany()
            if (!posts) {
                res.status(404).json({
                    message: "No posts"
                })

            } else {
                res.json(posts)
            }
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }

    },
    get: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.postId)
            const post = await prisma.post.findUnique({
                where: {
                    id: id
                },
                include: {
                    Comment: true
                }
            })
            if (!post) {
                res.status(404).json({
                    message: "Post not found"
                })
            } else {
                res.json(post)
            }
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    getComments: async (req: Request, res: Response) => {
        try {
            const postId = Number(req.params.postId)
            const comments = await prisma.comment.findMany({
                where: {
                    postId: postId
                }
            })
            if (!comments) {
                res.json({
                    message: "No comments for this post"
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
    create: async (req: Request, res: Response) => {
        try {
            const { title, content } = req.body
            await prisma.post.create({
                data: {
                    title: title,
                    content: content,
                    authorId: 1
                }
            })
            res.json({
                message: `Le post ${title} a été créé avec succès...`
            })
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const postId = Number(req.params.postId)
            const { title, content } = req.body
            await prisma.post.update({
                data: {
                    title: title,
                    content: content
                },
                where: {
                    id: postId
                }
            })
            res.json({
                message: `Le post ${title} a été modifié avec succès...`
            })
        } catch (error) {
            res.json({
                error: error.message
            })
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const postId = Number(req.params.postId)
            res.json({
                message: `Le post ${(await prisma.post.delete({
                    where: {
                        id: postId
                    }
                }))} a été supprimer avec succès`
            })
        } catch (error) {
            res.json({
                error: error.message
            })
        }
    }
}