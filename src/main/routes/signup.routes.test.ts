import request from "supertest"
import { app } from "../config/app"

describe("Signup Routes", () => {
	test("Should return an account on success", async () => {
		await request(app)
			.post("/api/signup")
			.send({
				name: "valid_name",
				email: "valid_email@email.com",
				password: "valid_password",
				password_confirmation: "valid_password",
			})
			.expect(200)
	})
})
