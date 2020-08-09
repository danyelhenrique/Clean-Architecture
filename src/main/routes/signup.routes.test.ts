import request from "supertest"
import { app } from "../config/app"
import mongoHelper from "../../infra/db/mongoDb/helpers/mongoHelper"

describe("Signup Routes", () => {
	beforeAll(async () => {
		await mongoHelper.connect(process.env.MONGO_URL)
	})

	beforeEach(async () => {
		const accountCollection = mongoHelper.getCollection("accounts")
		await accountCollection.deleteMany({})
	})

	afterAll(async () => {
		await mongoHelper.disconnect()
	})

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
