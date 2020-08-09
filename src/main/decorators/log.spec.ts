import { LogControllerDecorator } from "./log"
import {
	IController,
	HttpRequest,
	HttpResponse,
} from "../../presetantion/protocols"

interface IReturn {
	controllerStub: IController
	sut: IController
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
	const sut = new LogControllerDecorator(controllerStub)

	return {
		sut,
		controllerStub,
	}
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
})
