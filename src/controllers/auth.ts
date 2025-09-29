import prisma from '../../prisma/client.ts'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

export default {
    authGet: (req: Request, res: Response) => {
        res.render('login', { title: 'Login' })
    },

    registerGet: (req: Request, res: Response) => {
        res.render('register', { title: 'Register' })
    },

    registerPost: async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10)
            await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPassword
                }
            })
            res.json({
                message: "User created"
            })
        } catch (error) {
            res.status(400).json({
                error: error.message
            })
        }
    }
}