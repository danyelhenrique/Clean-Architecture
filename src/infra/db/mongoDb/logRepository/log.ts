import { ILogErrorRepository } from "../../../../data/protocols/ILogErrorRepository"
import mongoHelper from "../helpers/mongoHelper"

export class LogMongoRepository implements ILogErrorRepository {
	async logError(stackError: string): Promise<void> {
		const errosCollection = await mongoHelper.getCollection("errors")

		await errosCollection.insertOne({
			stack: stackError,
			date: new Date(),
		})
	}
}
