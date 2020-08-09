import { IController, HttpRequest } from "../../presetantion/protocols"
import { Request, Response } from "express"

export const adaptRoute = (controller: IController) => {
	return async (req: Request, res: Response) => {
		const httpRequest: HttpRequest = {
			body: req.body,
		}

		const httpResponse = await controller.handle(httpRequest)

		return res.status(httpResponse.statusCode).json(httpResponse.body)
	}
}
