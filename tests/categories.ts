import categoryRouter from "../src/routes/category.ts"

import request from "supertest"
import express from "express"
import test from "node:test"

const app = express()

app.use(express.urlencoded({ extended: false }))

app.use("/", categoryRouter)
