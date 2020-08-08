import { MissingParamError, InvalidParamError } from "../erros"

import { badRequest, serverError } from "../helpers/httpHelper"
import {
	IController,
	IEmailValidador,
	HttpRequest,
	HttpResponse,
} from "../protocols"

import { IAddAccount } from "../../domain/useCases/IAddAccount"

export class SignUpController implements IController {
	constructor(
		private readonly emailValidator: IEmailValidador,
		private readonly addAccount: IAddAccount
	) {}

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

			const {
				email,
				password,
				name,
				password_confirmation,
			} = httpRequest.body

			if (password_confirmation !== password) {
				return badRequest(
					new InvalidParamError("password_confirmation")
				)
			}
			const isValid = this.emailValidator.isValid(email)

			if (!isValid) {
				return badRequest(new InvalidParamError("email"))
			}

			this.addAccount.add({
				email,
				name,
				password,
			})
		} catch {
			return serverError()
		}
	}
}
