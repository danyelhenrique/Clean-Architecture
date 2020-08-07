import { HttpResponse, HttpRequest } from "../protocols/http"
import { MissingParamError } from "../erros/missingParamError"
import { badRequest, serverError } from "../helpers/httpHelper"
import { IController } from "../protocols/controller"
import { EmailValidador } from "../protocols/emaiValidator"
import { InvalidParamError } from "../erros/invalidParamError"

export class SignUpController implements IController {
	constructor(private readonly emailValidator: EmailValidador) {}
	handle(httpRequest: HttpRequest): HttpResponse {
		const requiredFields = [
			"name",
			"email",
			"password",
			"password_confirmation",
		]

		try {
			for (const fiel of requiredFields) {
				if (!httpRequest.body[fiel]) {
					return badRequest(new MissingParamError(fiel))
				}
			}
			const isValid = this.emailValidator.isValid(httpRequest.body.email)

			if (!isValid) {
				return badRequest(new InvalidParamError("email"))
			}
		} catch {
			return serverError()
		}
	}
}
