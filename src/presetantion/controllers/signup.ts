import { HttpResponse, HttpRequest } from "../protocols/http"
import { MissingParamErro } from "../erros/missingParamErro"
import { badRequest } from "../helpers/httpHelper"

export class SignUpController {
	handle(httpRequest: HttpRequest): HttpResponse {
		const requiredFields = ["name", "email"]

		for (const fiel of requiredFields) {
			if (!httpRequest.body[fiel]) {
				return badRequest(new MissingParamErro(fiel))
			}
		}
	}
}
