import { LogControllerDecorator } from "./log"
import {
	IController,
	HttpRequest,
	HttpResponse,
} from "../../presetantion/protocols"

describe("LogController Decorator", () => {
	test("Should call controller handle", async () => {
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

		const controllerStub = new ControllerStub()
		const handleSpy = jest.spyOn(controllerStub, "handle")

		const sut = new LogControllerDecorator(controllerStub)

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
