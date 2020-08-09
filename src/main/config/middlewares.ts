import { Express } from "express"
import { bodyParse, CORS, CORSMIDDLEWARE, ContentType } from "../middlewares"

export const middlewares = (app: Express): void => {
	app.use(bodyParse)
	app.use(CORS)
	app.use(CORSMIDDLEWARE)
	app.use(ContentType)
}
