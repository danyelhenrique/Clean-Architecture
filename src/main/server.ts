import mongoHelper from "../infra/db/mongoDb/helpers/mongoHelper"
import env from "./config/env"

mongoHelper
	.connect(env.mongoURL)
	.then(async () => {
		const { app } = await import("./config/app")

		app.listen(env.PORT, () => {
			console.log(`Server is running on http://localhost:${env.PORT}`)
		})
	})
	.catch(console.error)
