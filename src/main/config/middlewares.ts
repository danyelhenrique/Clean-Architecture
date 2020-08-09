import { Express } from "express"
import { bodyParse } from "../middlewares/bodyParser"
import { CORS, CORSMIDDLEWARE } from "../middlewares/cors"

export const middlewares = (app: Express): void => {
	app.use(bodyParse)
	app.use(CORS)
	app.use(CORSMIDDLEWARE)
}
