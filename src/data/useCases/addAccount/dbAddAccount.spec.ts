import { DbAddAccount } from "./dbAddAccount"
import { IEncrypter } from "./dbAddAccountProtocols"

interface ISutReturn {
	sut: DbAddAccount
	encrypterStub: IEncrypter
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
const makeSut = (): ISutReturn => {
	const encrypterStub = makeEncrypter()
	const sut = new DbAddAccount(encrypterStub)

	return {
		sut,
		encrypterStub,
	}
}
describe("DbAddAccount UseCase", () => {
	test("Should call Encrypter with correct password", async () => {
		const { encrypterStub, sut } = makeSut()

		const encryptSpy = jest.spyOn(encrypterStub, "encrypt")

		const accoutnData = {
			name: "valid_name",
			email: "valid_name@email.com",
			password: "valid_password",
		}

		await sut.add(accoutnData)

		expect(encryptSpy).toHaveBeenCalledWith("valid_password")
	})

	test("Should throw  if Encrypter throws", async () => {
		const { encrypterStub, sut } = makeSut()

		jest.spyOn(encrypterStub, "encrypt").mockResolvedValueOnce(
			Promise.reject(new Error())
		)

		const accoutnData = {
			name: "valid_name",
			email: "valid_name@email.com",
			password: "valid_password",
		}

		const accountPromise = sut.add(accoutnData)

		await expect(accountPromise).rejects.toThrow()
	})
})
