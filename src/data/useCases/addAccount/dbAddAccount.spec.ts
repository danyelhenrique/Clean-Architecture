import { DbAddAccount } from "./dbAddAccount"

describe("DbAddAccount UseCase", () => {
	test("Should call Encrypter with correct password", async () => {
		class EncrypterStub {
			async encrypt(value: string): Promise<string> {
				return Promise.resolve("hashed_password")
			}
		}

		const encrypterStub = new EncrypterStub()
		const sut = new DbAddAccount(encrypterStub)

		const encryptSpy = jest.spyOn(encrypterStub, "encrypt")
		const accoutnData = {
			name: "valid_name",
			email: "valid_name@email.com",
			password: "valid_password",
		}

		await sut.add(accoutnData)

		expect(encryptSpy).toHaveBeenCalledWith("valid_password")
	})
})
