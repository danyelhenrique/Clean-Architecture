import { HttpResponse, HttpRequest } from "../protocols/http"
import { MissingParamErro } from "../erros/missingParamErro"
import { badRequest } from "../helpers/httpHelper"
import { IController } from "../protocols/controller"

export class SignUpController implements IController {
	handle(httpRequest: HttpRequest): HttpResponse {
		const requiredFields = [
			"name",
			"email",
			"password",
			"password_confirmation",
		]

		for (const fiel of requiredFields) {
			if (!httpRequest.body[fiel]) {
				return badRequest(new MissingParamErro(fiel))
			}
		}
	}
}
