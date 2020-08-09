import { Router } from "express"

import { MakeSignUpController } from "../factories/signup"
import { adaptRoute } from "../adapters/expressRouteAdapter"

export default (router: Router): void => {
	router.post("/signup", adaptRoute(MakeSignUpController.createFactory))
}
