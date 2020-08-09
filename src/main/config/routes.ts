import { Express, Router } from "express"
import fg from "fast-glob"

export const routers = (app: Express): void => {
	const router = Router()

	app.use("/api", router)

	fg.sync("**/src/main/routes/**routes.ts").map(async (file) => {
		const routes = (await import(`../../../${file}`)).default
		routes(router)
	})
}
