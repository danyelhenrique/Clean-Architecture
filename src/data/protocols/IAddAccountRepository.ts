import { IAddAccountModel } from "../../domain/useCases/IAddAccount"
import { IAccountModel } from "../../domain/models/IAccountModel"

export interface IAddAccountRepository {
	add(accountData: IAddAccountModel): Promise<IAccountModel>
}
