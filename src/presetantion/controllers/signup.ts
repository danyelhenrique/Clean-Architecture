import { HttpResponse, HttpRequest } from "../protocols/http"
import { MissingParamErro } from "../erros/missingParamErro"
import { badRequest } from "../helpers/httpHelper"

export class SignUpController {
	handle(httpRequest: HttpRequest): HttpResponse {
		if (!httpRequest.body.name) {
			return badRequest(new MissingParamErro("name"))
		}

		if (!httpRequest.body.email) {
			return badRequest(new MissingParamErro("email"))
		}
	}
}
