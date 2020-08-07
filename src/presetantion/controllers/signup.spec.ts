import { SignUpController } from "./signup"

describe("SignUp Controller", () => {
	test("Should return 400 if no name is provided", () => {
		// System under test (sut)
		const sut = new SignUpController()

		const httpRequest = {
			body: {
				email: "any_email@email.com",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new Error("Missing param: name"))
	})

	test("Should return 400 if no email is provided", () => {
		const sut = new SignUpController()

		const httpRequest = {
			body: {
				name: "any_name",
				password: "any_password",
				password_confirmation: "any_password",
			},
		}
		const httpResponse = sut.handle(httpRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new Error("Missing param: email"))
	})
})
