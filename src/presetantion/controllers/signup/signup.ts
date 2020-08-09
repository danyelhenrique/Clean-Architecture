import {
	IEmailValidador,
	IAddAccount,
	IController,
	HttpRequest,
	HttpResponse,
} from "./signupProtocols"
import { badRequest, serverError, success } from "../../helpers/httpHelper"
import { MissingParamError, InvalidParamError } from "../../erros"

export class SignUpController implements IController {
	constructor(
		private readonly emailValidator: IEmailValidador,
		private readonly addAccount: IAddAccount
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

			const account = await this.addAccount.add({
				email,
				name,
				password,
			})

			return success(account)
		} catch (error) {
			return serverError(error)
		}
	}
}
