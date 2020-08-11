import { LogControllerDecorator } from "./log"
import {
	IController,
	HttpRequest,
	HttpResponse,
} from "../../presetantion/protocols"
import { serverError } from "../../presetantion/helpers/httpHelper"
import { ILogErrorRepository } from "../../data/protocols/ILogErrorRepository"

interface IReturn {
	controllerStub: IController
	sut: IController
	logErrorRepositoryStub: ILogErrorRepository
}

const makeController = () => {
	class ControllerStub implements IController {
		async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
			const httpResponse: HttpResponse = {
				body: {
					name: "any_name",
				},
				statusCode: 200,
			}
			return Promise.resolve(httpResponse)
		}
	}
	return new ControllerStub()
}

const makeSut = (): IReturn => {
	const controllerStub = makeController()
	const logErrorRepositoryStub = makeLogErrorRepository()
	const sut = new LogControllerDecorator(
		controllerStub,
		logErrorRepositoryStub
	)
	return {
		sut,
		controllerStub,
		logErrorRepositoryStub,
	}
}

const makeLogErrorRepository = (): ILogErrorRepository => {
	class LogErrorRepositoryStub implements ILogErrorRepository {
		async log(stackError: string): Promise<void> {
			return Promise.resolve()
		}
	}
	return new LogErrorRepositoryStub()
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

const makeFakeServerError = (): HttpResponse => {
	const fakeError = new Error()

	fakeError.stack = "any_stack_error"

	const error = serverError(fakeError)

	return error
}
describe("LogController Decorator", () => {
	test("Should call controller handle", async () => {
		const { sut, controllerStub } = makeSut()

		const handleSpy = jest.spyOn(controllerStub, "handle")

		const httRequest = makeHttpRequest()

		await sut.handle(httRequest)
		expect(handleSpy).toHaveBeenCalledWith(httRequest)
	})

	test("Should return the same result of then controller", async () => {
		const { sut } = makeSut()

		const httRequest = makeHttpRequest()

		const httpResponse = await sut.handle(httRequest)

		expect(httpResponse).toEqual({
			body: {
				name: "any_name",
			},
			statusCode: 200,
		})
	})

	test("Should call logErrorRepository with correct error if controller returns a server", async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

		const logSpy = jest.spyOn(logErrorRepositoryStub, "log")

		jest.spyOn(controllerStub, "handle").mockReturnValueOnce(
			Promise.resolve(makeFakeServerError())
		)

		const httRequest = makeHttpRequest()

		await sut.handle(httRequest)

		expect(logSpy).toHaveBeenCalledWith("any_stack_error")
	})
})
