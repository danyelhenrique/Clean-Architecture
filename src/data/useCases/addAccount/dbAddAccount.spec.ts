import { DbAddAccount } from "./dbAddAccount"
import {
	IEncrypter,
	IAccountModel,
	IAddAccountModel,
	IAddAccountRepository,
} from "./dbAddAccountProtocols"

interface ISutReturn {
	sut: DbAddAccount
	encrypterStub: IEncrypter
	addAccountRepositoryStub: any
}

const makeEncrypter = (): IEncrypter => {
	class EncrypterStub implements IEncrypter {
		async encrypt(value: string): Promise<string> {
			return Promise.resolve("hashed_password")
		}
	}
	const encrypterStub = new EncrypterStub()

	return encrypterStub
}

const makeaddAccountRepository = (): IAddAccountRepository => {
	class AddAccountRepositoryStub implements IAddAccountRepository {
		async add(accountData: IAddAccountModel): Promise<IAccountModel> {
			return Promise.resolve(makeFakeAccount())
		}
	}
	const addAccountRepositoryStub = new AddAccountRepositoryStub()

	return addAccountRepositoryStub
}

const makeSut = (): ISutReturn => {
	const encrypterStub = makeEncrypter()
	const addAccountRepositoryStub = makeaddAccountRepository()
	const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

	return {
		sut,
		encrypterStub,
		addAccountRepositoryStub,
	}
}

const makeFakeAccount = (): IAccountModel => {
	const fakeAccount: IAccountModel = {
		id: "valid_id",
		email: "valid_email",
		name: "valid_name",
		password: "hashed_password",
	}
	return fakeAccount
}

const makeFakeAccountData = (): IAddAccountModel => {
	return {
		name: "valid_name",
		email: "valid_name@email.com",
		password: "valid_password",
	}
}
describe("DbAddAccount UseCase", () => {
	test("Should call Encrypter with correct password", async () => {
		const { encrypterStub, sut } = makeSut()

		const encryptSpy = jest.spyOn(encrypterStub, "encrypt")

		await sut.add(makeFakeAccountData())

		expect(encryptSpy).toHaveBeenCalledWith("valid_password")
	})

	test("Should throw  if Encrypter throws", async () => {
		const { encrypterStub, sut } = makeSut()

		jest.spyOn(encrypterStub, "encrypt").mockResolvedValueOnce(
			Promise.reject(new Error())
		)

		const accountPromise = sut.add(makeFakeAccountData())

		await expect(accountPromise).rejects.toThrow()
	})

	test("Should call AddAccountRepository with correct values", async () => {
		const { addAccountRepositoryStub, sut } = makeSut()

		const addSpy = jest.spyOn(addAccountRepositoryStub, "add")

		await sut.add(makeFakeAccountData())

		expect(addSpy).toHaveBeenCalledWith({
			name: "valid_name",
			email: "valid_name@email.com",
			password: "hashed_password",
		})
	})

	test("Should throw if AddAccountRepository throws", async () => {
		const { addAccountRepositoryStub, sut } = makeSut()

		jest.spyOn(addAccountRepositoryStub, "add").mockResolvedValueOnce(
			Promise.reject(new Error())
		)

		const accountPromise = sut.add(makeFakeAccountData())

		await expect(accountPromise).rejects.toThrow()
	})

	test("Should return an account on succes", async () => {
		const { sut } = makeSut()

		const accountData = makeFakeAccount()

		const account = await sut.add(accountData)

		expect(account).toEqual(makeFakeAccount())
	})
})
