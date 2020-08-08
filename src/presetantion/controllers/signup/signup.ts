import {
	IEmailValidador,
	IAddAccount,
	IController,
	HttpRequest,
	HttpResponse,
} from "./signupProtocols"
import { badRequest, serverError } from "../../helpers/httpHelper"
import { MissingParamError, InvalidParamError } from "../../erros"

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

			const account = this.addAccount.add({
				email,
				name,
				password,
			})

			return {
				statusCode: 200,
				body: account,
			}
		} catch {
			return serverError()
		}
	}
}
