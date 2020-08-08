import {
	IAddAccount,
	IEncrypter,
	IAddAccountModel,
	IAccountModel,
	IAddAccountRepository,
} from "./dbAddAccountProtocols"

export class DbAddAccount implements IAddAccount {
	constructor(
		private readonly encrypter: IEncrypter,
		private readonly addAccountRepository: IAddAccountRepository
	) {}

	async add(accountData: IAddAccountModel): Promise<IAccountModel> {
		const passwordHashed = await this.encrypter.encrypt(
			accountData.password
		)
		const account = await this.addAccountRepository.add({
			...accountData,
			password: passwordHashed,
		})

		return account
	}
}
