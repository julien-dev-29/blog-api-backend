import prisma from '../../prisma/client.ts'
import { Request, Response } from 'express'

const perPage = 10

export default {
    get: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.categoryId)
            const category = await prisma.category.findUnique({
                where: {
                    id: id
                }
            })
            if (!category) {
                res.status(404).json({
                    message: "Category not found"
                })
            } else {
                res.json(category)
            }
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    getPaginatedCategories: async (req: Request, res: Response) => {
        try {
            const pageNumber = Number(req.query.p) ?? 1
            const offset = (pageNumber - 1) * perPage
            const [categories, total] = await Promise.all([prisma.category.findMany({
                skip: offset,
                take: perPage
            }),
            prisma.category.count()
            ])
            if (!categories) {
                res.status(404).json({
                    message: "No comments"
                })
            } else {
                res.json({
                    categories: categories,
                    total: Math.ceil(total / 10) === 0 ? 1 : Math.ceil(total / 10),
                    page: pageNumber
                })
            }
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const { category } = req.body
            const newCategory = await prisma.category.create({
                data: {
                    name: category.name
                }
            })
            res.status(201).json(newCategory)
        } catch (error) {
            console.log(error);

            res.status(400).json({
                error: error.message
            })
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            console.log(req.params.categoryId);

            const id = Number(req.params.categoryId)
            const { name } = req.body
            const updatedCategory = await prisma.category.update({
                where: {
                    id: id
                },
                data: {
                    name
                }
            })
            res.status(201).json(updatedCategory)
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.categoryId)
            await prisma.category.update({
                where: {
                    id: id
                },
                data: {
                    posts: {
                        set: []
                    }
                }
            })
            await prisma.category.delete({
                where: {
                    id: id,
                }
            })
            res.status(201).send({
                message: "Category delete with success"
            })
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    }
}