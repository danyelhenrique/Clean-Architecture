import cors from "cors"
import { Request, Response, NextFunction } from "express"

export const CORS = cors({
	allowedHeaders: "*",
	methods: "*",
	origin: "*",
})

export const CORSMIDDLEWARE = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	res.set("access-control-allow-methods", "*")
	res.set("access-control-allow-headers", "*")
	next()
}
