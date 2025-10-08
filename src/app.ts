import "dotenv/config"
import express from "express"
import { Request, Response } from "express"
import cors from 'cors'
import morgan from 'morgan'
import passport from "passport"
import bodyParser from "body-parser"
import session from 'express-session'
import { PrismaSessionStore } from "@quixo3/prisma-session-store"
import prisma from '../prisma/client.ts'
import postRouter from '../src/routes/post.ts'
import authRouter from "./routes/auth.ts"
import commentRouter from '../src/routes/comment.ts'
import helmet from "helmet"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())
app.use(morgan("combined"))
app.use(bodyParser.json())
app.use(express.json())

app.use(
    session({
        secret: process.env.SESSION_SECRET || "cats",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 jour
        },
        store: new PrismaSessionStore(
            prisma as any, // Cast to 'any' to satisfy type requirement
            {
                checkPeriod: 2 * 60 * 1000,  // toutes les 2 min, supprime les sessions expirées
                dbRecordIdIsSessionId: true, // option pratique
                dbRecordIdFunction: undefined,
            }
        ),
    })
);

// Passport
import '../config/passport.js'

app.use(passport.initialize())
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user
    next();
});

app.use('/api', authRouter)
app.use('/api/posts', postRouter)
app.use('/api/comments', passport.authenticate("jwt", { session: false }), commentRouter)

app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`🚀 Blog api listening on port ${PORT}`);
})
