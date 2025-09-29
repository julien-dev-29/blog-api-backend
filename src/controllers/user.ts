import { get } from 'http'
import prisma from '../../prisma/client.ts'
import { Request, Response } from 'express'

export default {
    getAll: async (req: Request, res: Response) => {
        const users = await prisma.user.findMany()
        if (!users) {
            res.status(404).json({
                message: "Users not found"
            })
        } else {
            res.json(users)
        }
    },
    get: async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.userId)
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!user) {
                res.status(404).json({
                    message: "User not found"
                })
            } else {
                res.json(user)
            }
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body
            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "Name, email and password are required"
                })
            }
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password
                }
            })
            res.status(201).json({
                message: "User successfully created",
                user: newUser
            })
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.userId)
            const { name, email } = req.body
            const updatedUser = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    name,
                    email
                }
            })
            res.json({
                message: "User successfully updated",
                user: updatedUser
            })
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.userId)
            const deletedUser = await prisma.user.delete({
                where: {
                    id: userId
                }
            })
            res.json({
                message: "User successfully deleted",
                user: deletedUser
            })
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    }
}