import { IAddAccountRepository } from "../../../../data/protocols/IAddAccountRepository"
import { IAddAccountModel } from "../../../../domain/useCases/IAddAccount"
import { IAccountModel } from "../../../../data/useCases/addAccount/dbAddAccountProtocols"
import MongoHelper from "../helpers/mongoHelper"

export class AccountMongoRepository implements IAddAccountRepository {
	async add(accountData: IAddAccountModel): Promise<IAccountModel> {
		const accountCollection = MongoHelper.getCollection("accounts")
		const { ops } = await accountCollection.insertOne(accountData)
		const account = ops[0]
		const { _id, ...restProps } = account

		return { ...restProps, id: _id }
	}
}