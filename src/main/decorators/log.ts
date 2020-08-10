import {
	IController,
	HttpRequest,
	HttpResponse,
} from "../../presetantion/protocols"

import { ILogErrorRepository } from "../../data/protocols/ILogErrorRepository"

export class LogControllerDecorator implements IController {
	constructor(
		private readonly controller: IController,
		private readonly logErrorRepository: ILogErrorRepository
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const httpResponse = await this.controller.handle(httpRequest)

		if (httpResponse.statusCode === 500) {
			await this.logErrorRepository.log(httpResponse.body.stack)
		}
		return httpResponse
	}
}
