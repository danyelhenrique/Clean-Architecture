import { MongoClient, MongoClientOptions, Collection } from "mongodb"

class MongoHelper {
	private client: MongoClient | null
	private uri: string | null = null

	async connect(uri: string, opts?: MongoClientOptions): Promise<void> {
		this.uri = uri

		this.client = await MongoClient.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			...opts,
		})
	}

	async disconnect(): Promise<void> {
		await this.client.close()
		this.client = null
	}

	async getCollection(name: string): Promise<Collection> {
		if (!this.client?.isConnected()) {
			await this.connect(this.uri)
		}
		return this.client.db().collection(name)
	}

	map(collection: any): any {
		const { _id, ...collectionWithoudId } = collection
		return { ...collectionWithoudId, id: _id }
	}
}

export default new MongoHelper()
