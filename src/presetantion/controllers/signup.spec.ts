import { SignUpController } from "./signup"
import { MissingParamErro } from "../erros/missingParamErro"
import { InvalidParamErro } from "../erros/InvalidParamErro"
import { EmailValidador } from "../protocols/emaiValidator"

interface ISutReturn {
	sut: SignUpController
	emailValidatorStub: EmailValidador
}
//factory to  make sut
const makeSut = (): ISutReturn => {
	class EmailValidatorStub implements EmailValidador {
		isValid(email: string): boolean {
			return true
		}
	}

	const emailValidatorStub = new EmailValidatorStub()
	const sut = new SignUpController(emailValidatorStub)

	return {
		sut,
		emailValidatorStub,
	}
}

describe("SignUp Controller", () => {
	test("Should return 400 if no name is provided", () => {
		// System under test (sut)
		const { sut } = makeSut()

		const httpRequest = {
			body: {
				email: "any_email@email.com",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamErro("name"))
	})

	test("Should return 400 if no email is provided", () => {
		const { sut } = makeSut()

		const httpRequest = {
			body: {
				name: "any_name",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamErro("email"))
	})

	test("Should return 400 if no password is provided", () => {
		const { sut } = makeSut()

		const httpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamErro("password"))
	})

	test("Should return 400 if no password_confirmation is provided", () => {
		const { sut } = makeSut()

		const httpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password: "any_password",
			},
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(
			new MissingParamErro("password_confirmation")
		)
	})

	test("Should return 400 if and invalid email is provided", () => {
		const { sut, emailValidatorStub } = makeSut()

		jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)

		const httpRequest = {
			body: {
				email: "invalid_email.com",
				name: "any_name",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamErro("email"))
	})
})
