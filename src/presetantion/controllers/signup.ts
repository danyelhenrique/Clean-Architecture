import { MissingParamError, InvalidParamError } from "../erros"

import { badRequest, serverError } from "../helpers/httpHelper"
import {
	IController,
	IEmailValidador,
	HttpRequest,
	HttpResponse,
} from "../protocols"

export class SignUpController implements IController {
	constructor(private readonly emailValidator: IEmailValidador) {}
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

			if (
				httpRequest.body.password_confirmation !==
				httpRequest.body.password
			) {
				return badRequest(
					new InvalidParamError("password_confirmation")
				)
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
