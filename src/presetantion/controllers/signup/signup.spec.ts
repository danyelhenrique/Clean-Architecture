import { SignUpController } from "./signup"

import {
	IEmailValidador,
	IAddAccount,
	IAddAccountModel,
	IAccountModel,
} from "./signupProtocols"
import { MissingParamError, InvalidParamError, ServerError } from "../../erros"

interface ISutReturn {
	sut: SignUpController
	emailValidatorStub: IEmailValidador
	addAccountStub: IAddAccount
}

const makeEmailValidator = (): IEmailValidador => {
	class EmailValidatorStub implements IEmailValidador {
		isValid(email: string): boolean {
			return true
		}
	}

	return new EmailValidatorStub()
}
const makeAddAccountStub = (): IAddAccount => {
	class AddAccountStub implements IAddAccount {
		async add(account: IAddAccountModel): Promise<IAccountModel> {
			const fakeAccount = {
				id: "valid_id",
				name: "valid_name",
				email: "valid_email@email.com",
				password: "valid_password",
			}

			return Promise.resolve(fakeAccount)
		}
	}

	return new AddAccountStub()
}

//factory to  make sut
const makeSut = (): ISutReturn => {
	const emailValidatorStub = makeEmailValidator()
	const addAccountStub = makeAddAccountStub()

	const sut = new SignUpController(emailValidatorStub, addAccountStub)

	return {
		sut,
		emailValidatorStub,
		addAccountStub,
	}
}

describe("SignUp Controller", () => {
	test("Should return 400 if no name is provided", async () => {
		// System under test (sut)
		const { sut } = makeSut()

		const httpRequest = {
			body: {
				email: "any_email@email.com",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError("name"))
	})

	test("Should return 400 if no email is provided", async () => {
		const { sut } = makeSut()

		const httpRequest = {
			body: {
				name: "any_name",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError("email"))
	})

	test("Should return 400 if no password is provided", async () => {
		const { sut } = makeSut()

		const httpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError("password"))
	})

	test("Should return 400 if no password_confirmation is provided", async () => {
		const { sut } = makeSut()

		const httpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password: "any_password",
			},
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(
			new MissingParamError("password_confirmation")
		)
	})

	test("Should return 400 if password_confirmation fails", async () => {
		const { sut } = makeSut()

		const httpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password: "any_password",
				password_confirmation: "invalid_password_confirmation",
			},
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(
			new InvalidParamError("password_confirmation")
		)
	})

	test("Should return 400 if and invalid email is provided", async () => {
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
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError("email"))
	})

	test("Should call EmailValidator with correct email", async () => {
		const { sut, emailValidatorStub } = makeSut()

		const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")

		const httpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		await sut.handle(httpRequest)
		expect(isValidSpy).toHaveBeenCalledWith("any_email@email.com")
	})

	test("Should return 500 if EmailValidator Throws", async () => {
		const { sut, emailValidatorStub } = makeSut()

		jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
			throw new Error()
		})
		const httpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new ServerError())
	})

	test("Should call AddAccount with correct values [name,  email, password]", async () => {
		const { sut, addAccountStub } = makeSut()

		const addSpy = jest.spyOn(addAccountStub, "add")

		const httpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		await sut.handle(httpRequest)

		expect(addSpy).toHaveBeenCalledWith({
			email: "any_email@email.com",
			name: "any_name",
			password: "any_password",
		})
	})
	test("Should return 500 if AddAccount Throws", async () => {
		const { sut, addAccountStub } = makeSut()

		jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
			return Promise.reject(new Error())
		})

		const httpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new ServerError())
	})

	test("Should return 200 if valid data is provided", async () => {
		const { sut } = makeSut()

		const httpRequest = {
			body: {
				email: "valid_email@email.com",
				name: "valid_name",
				password: "valid_password",
				password_confirmation: "valid_password",
			},
		}
		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(200)

		expect(httpResponse.body).toEqual({
			id: "valid_id",
			email: "valid_email@email.com",
			name: "valid_name",
			password: "valid_password",
		})
	})
})
