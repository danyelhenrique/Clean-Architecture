import express from "express"
import { middlewares } from "./middlewares"

export const app = express()
middlewares(app)
