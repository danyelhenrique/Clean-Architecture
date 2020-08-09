import { SignUpController } from "../../presetantion/controllers/signup/signup"
import { EmailValidatorAdapter } from "../../utils/emailValidatorAdapter"
import { DbAddAccount } from "../../data/useCases/addAccount/dbAddAccount"
import { BcryptAdater } from "../../infra/criptography/bcryptAdapter"
import { AccountMongoRepository } from "../../infra/db/mongoDb/accountRepository/account"

export class MakeSignUpController {
	static createFactory(): SignUpController {
		const emailValidatorAdapter = new EmailValidatorAdapter()

		const bcryptAdater = new BcryptAdater({ salt: 12 })

		const accountMongoRepository = new AccountMongoRepository()

		const dbAddAccount = new DbAddAccount(
			bcryptAdater,
			accountMongoRepository
		)

		const signUpController = new SignUpController(
			emailValidatorAdapter,
			dbAddAccount
		)

		return signUpController
	}
}
