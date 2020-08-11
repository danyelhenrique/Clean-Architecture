import { Collection } from "mongodb"
import MongoHelper from "../helpers/mongoHelper"
import { LogMongoRepository } from "./log"

describe("Log Mongo Repository", () => {
	let errorConection: Collection

	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL)
	})

	beforeEach(async () => {
		errorConection = await MongoHelper.getCollection("errors")
		await errorConection.deleteMany({})
	})

	afterAll(async () => {
		await MongoHelper.disconnect()
	})

	test("Should create a error log on success", async () => {
		const sut = new LogMongoRepository()

		await sut.logError("any_stacK_err")

		const count = await errorConection.countDocuments()

		expect(count).toBe(1)
	})
})
