import { HttpResponse, HttpRequest } from "../protocols/http"
import { MissingParamErro } from "../erros/missingParamErro"
import { badRequest } from "../helpers/httpHelper"
import { IController } from "../protocols/controller"
import { EmailValidador } from "../protocols/emaiValidator"
import { InvalidParamErro } from "../erros/InvalidParamErro"

export class SignUpController implements IController {
	constructor(private readonly emailValidator: EmailValidador) {}
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
		const isValid = this.emailValidator.isValid(httpRequest.body.email)

		if (!isValid) {
			return badRequest(new InvalidParamErro("email"))
		}
	}
}
