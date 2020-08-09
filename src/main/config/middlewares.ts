import { Express } from "express"
import { bodyParse } from "../middlewares/bodyParser"
import { CORS, CORSMIDDLEWARE } from "../middlewares/cors"
import { ContentType } from "../middlewares/contentType"

export const middlewares = (app: Express): void => {
	app.use(bodyParse)
	app.use(CORS)
	app.use(CORSMIDDLEWARE)
	app.use(ContentType)
}
