import { Express } from "express"

import { bodyParse } from "../middlewares/bodyParser"

export const middlewares = (app: Express): void => {
	app.use(bodyParse)
}
