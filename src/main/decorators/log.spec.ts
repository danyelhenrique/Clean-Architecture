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
describe("LogController Decorator", () => {
	test("Should call controller handle", async () => {
		const { sut, controllerStub } = makeSut()

		const handleSpy = jest.spyOn(controllerStub, "handle")

		const httRequest = {
			body: {
				email: "valid_email",
				name: "valid_name",
				password: "valid_password",
				password_confirmation: "valid_password",
			},
		}

		await sut.handle(httRequest)
		expect(handleSpy).toHaveBeenCalledWith(httRequest)
	})

	test("Should return the same result of then controller", async () => {
		const { sut } = makeSut()

		const httRequest = {
			body: {
				email: "valid_email",
				name: "valid_name",
				password: "valid_password",
				password_confirmation: "valid_password",
			},
		}

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
		const fakeError = new Error()

		fakeError.stack = "any_stack_error"

		const error = serverError(fakeError)

		const logSpy = jest.spyOn(logErrorRepositoryStub, "log")

		jest.spyOn(controllerStub, "handle").mockReturnValueOnce(
			Promise.resolve(error)
		)

		const httRequest = {
			body: {
				email: "valid_email",
				name: "valid_name",
				password: "valid_password",
				password_confirmation: "valid_password",
			},
		}

		await sut.handle(httRequest)

		expect(logSpy).toHaveBeenCalledWith("any_stack_error")
	})
})
