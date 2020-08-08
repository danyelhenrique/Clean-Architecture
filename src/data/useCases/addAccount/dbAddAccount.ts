import {
	IAddAccount,
	IEncrypter,
	IAddAccountModel,
	IAccountModel,
} from "./dbAddAccountProtocols"

export class DbAddAccount implements IAddAccount {
	constructor(private readonly encrypter: IEncrypter) {}
	async add(account: IAddAccountModel): Promise<IAccountModel> {
		await this.encrypter.encrypt(account.password)
		return Promise.resolve(null)
	}
}
