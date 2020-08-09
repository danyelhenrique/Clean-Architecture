import express from "express"
import { middlewares } from "./middlewares"
import { routers } from "./routes"

export const app = express()
middlewares(app)
routers(app)
