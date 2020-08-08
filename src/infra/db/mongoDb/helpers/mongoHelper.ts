import { MongoClient, MongoClientOptions } from "mongodb"

class MongoHelper {
	private client: MongoClient

	async connect(uri: string, opts?: MongoClientOptions): Promise<void> {
		this.client = await MongoClient.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			...opts,
		})
	}

	async disconnect(): Promise<void> {
		await this.client.close()
	}
}

export default new MongoHelper()
