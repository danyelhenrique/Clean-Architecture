import { SignUpController } from "../../presetantion/controllers/signup/signup"
import { EmailValidatorAdapter } from "../../utils/emailValidatorAdapter"
import { DbAddAccount } from "../../data/useCases/addAccount/dbAddAccount"
import { BcryptAdater } from "../../infra/criptography/bcryptAdapter"
import { AccountMongoRepository } from "../../infra/db/mongoDb/accountRepository/account"
import { IController } from "../../presetantion/protocols"
import { LogControllerDecorator } from "../decorators/log"

export class MakeSignUpController {
	static get createFactory(): IController {
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

		return new LogControllerDecorator(signUpController)
	}
}
