import {
	IAddAccount,
	IAddAccountModel,
} from "../../../domain/useCases/IAddAccount"
import { IAccountModel } from "../../../domain/models/IAccountModel"
import { IEncrypter } from "../../protocols/encrypter"

export class DbAddAccount implements IAddAccount {
	constructor(private readonly encrypter: IEncrypter) {}
	async add(account: IAddAccountModel): Promise<IAccountModel> {
		await this.encrypter.encrypt(account.password)
		return Promise.resolve(null)
	}
}
