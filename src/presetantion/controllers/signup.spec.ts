import { SignUpController } from "./signup"

describe("SignUp Controller", () => {
	test("Should return 400 if no name is provided", () => {
		// System under test (sut)
		const sut = new SignUpController()
		const httpRequest = {
			body: {
				email: "any_name@email.com",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
	})
})
