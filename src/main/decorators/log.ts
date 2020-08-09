import {
	IController,
	HttpRequest,
	HttpResponse,
} from "../../presetantion/protocols"

export class LogControllerDecorator implements IController {
	constructor(private readonly controller: IController) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const httpResponse = await this.controller.handle(httpRequest)

		// if (httpResponse.statusCode === 500) {
		// }
		return httpResponse
	}
}
