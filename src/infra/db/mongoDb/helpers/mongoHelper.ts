import { MongoClient, MongoClientOptions, Collection } from "mongodb"

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

	getCollection(name: string): Collection {
		return this.client.db().collection(name)
	}

	map(collection: any): any {
		const { _id, ...collectionWithoudId } = collection
		return { ...collectionWithoudId, id: _id }
	}
}

export default new MongoHelper()
