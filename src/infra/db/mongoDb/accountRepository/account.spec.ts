import MongoHelper from "../helpers/mongoHelper"
import { AccountMongoRepository } from "./account"

const makeSut = (): AccountMongoRepository => {
	const sut = new AccountMongoRepository()
	return sut
}
describe("Account Mongo Respository", () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL)
	})

	beforeEach(async () => {
		const accountCollection = MongoHelper.getCollection("accounts")
		await accountCollection.deleteMany({})
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
	})

	test("Should return an account on success", async () => {
		const sut = makeSut()
		const account = await sut.add({
			name: "any_name",
			email: "any_email@email.com",
			password: "any_password",
		})

		expect(account).toBeTruthy()
		expect(account.id).toBeTruthy()
		expect(account.name).toBe(account.name)
		expect(account.email).toBe(account.email)
		expect(account.password).toBe(account.password)
	})
})
