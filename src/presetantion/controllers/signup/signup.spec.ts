import { SignUpController } from "./signup"

import {
	IEmailValidador,
	IAddAccount,
	IAddAccountModel,
	IAccountModel,
} from "./signupProtocols"
import { MissingParamError, InvalidParamError, ServerError } from "../../erros"
import { HttpRequest } from "../../protocols"
import { success, badRequest, serverError } from "../../helpers/httpHelper"

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
			return Promise.resolve(makeFakeAccount())
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

const makeHttpRequest = (): HttpRequest => {
	const httpRequest = {
		body: {
			email: "any_email@email.com",
			name: "any_name",
			password: "any_password",
			password_confirmation: "any_password",
		},
	}

	return httpRequest
}
const makeFakeAccount = (): IAccountModel => {
	return {
		id: "valid_id",
		email: "valid_email@email.com",
		name: "valid_name",
		password: "valid_password",
	}
}

describe("SignUp Controller", () => {
	test("Should return 400 if no name is provided", async () => {
		// System under test (sut)
		const { sut } = makeSut()

		const httpRequest = makeHttpRequest()

		delete httpRequest.body.name

		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(badRequest(new MissingParamError("name")))
	})

	test("Should return 400 if no email is provided", async () => {
		const { sut } = makeSut()

		const httpRequest = makeHttpRequest()

		delete httpRequest.body.email

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
	})

	test("Should return 400 if no password is provided", async () => {
		const { sut } = makeSut()

		const httpRequest = makeHttpRequest()

		delete httpRequest.body.password

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(
			badRequest(new MissingParamError("password"))
		)
	})

	test("Should return 400 if no password_confirmation is provided", async () => {
		const { sut } = makeSut()

		const httpRequest = makeHttpRequest()

		delete httpRequest.body.password_confirmation

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(
			badRequest(new MissingParamError("password_confirmation"))
		)
	})

	test("Should return 400 if password_confirmation fails", async () => {
		const { sut } = makeSut()

		const httpRequest = makeHttpRequest()

		httpRequest.body.password_confirmation = "wrong_password_confirmation"

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(
			badRequest(new InvalidParamError("password_confirmation"))
		)
	})

	test("Should return 400 if and invalid email is provided", async () => {
		const { sut, emailValidatorStub } = makeSut()

		jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)

		const httpRequest = makeHttpRequest()

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")))
	})

	test("Should call EmailValidator with correct email", async () => {
		const { sut, emailValidatorStub } = makeSut()

		const isValidSpy = jest.spyOn(emailValidatorStub, "isValid")

		const httpRequest = makeHttpRequest()

		await sut.handle(httpRequest)
		expect(isValidSpy).toHaveBeenCalledWith("any_email@email.com")
	})

	test("Should return 500 if EmailValidator Throws", async () => {
		const { sut, emailValidatorStub } = makeSut()

		jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
			throw new Error()
		})
		const httpRequest = makeHttpRequest()

		const error = new Error()
		error.stack = "any_stack"

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
	})

	test("Should call AddAccount with correct values [name,  email, password]", async () => {
		const { sut, addAccountStub } = makeSut()

		const addSpy = jest.spyOn(addAccountStub, "add")

		const httpRequest = makeHttpRequest()

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
		const error = new Error()
		error.stack = "any_stack"

		const httpRequest = makeHttpRequest()
		const httpResponse = await sut.handle(httpRequest)
		expect(httpResponse).toEqual(serverError(new ServerError(error.stack)))
	})

	test("Should return 200 if valid data is provided", async () => {
		const { sut } = makeSut()

		const httpResponse = await sut.handle(makeHttpRequest())

		expect(httpResponse).toEqual(success(makeFakeAccount()))
	})
})
