import { IController, HttpRequest } from "../../presetantion/protocols"
import { Request, Response } from "express"

export const adaptRoute = (controller: IController) => {
	return async (req: Request, res: Response) => {
		const httpRequest: HttpRequest = {
			body: req.body,
		}

		const httpResponse = await controller.handle(httpRequest)

		if (httpResponse.statusCode === 200) {
			return res.status(httpResponse.statusCode).json(httpResponse.body)
		} else {
			return res.status(httpResponse.statusCode).json({
				error: httpResponse.body.message,
			})
		}
	}
}
