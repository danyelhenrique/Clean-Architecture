import bcrypt from "bcrypt"
import { BcryptAdater } from "./bcryptAdapter"

jest.mock("bcrypt", () => {
	return {
		async hash(): Promise<string> {
			return Promise.resolve("hash")
		},
	}
})

interface IMakeSutReturn {
	sut: BcryptAdater
	salt: number
}

const makeSut = (): IMakeSutReturn => {
	const salt = 12
	const sut = new BcryptAdater({ salt })
	return {
		salt,
		sut,
	}
}

describe("Bcrypt Adaper", () => [
	test("Should call bcrypt with correct values", async () => {
		const { sut, salt } = makeSut()
		const hasSpy = jest.spyOn(bcrypt, "hash")

		await sut.encrypt("any_value")
		expect(hasSpy).toHaveBeenCalledWith("any_value", salt)
	}),

	test("Should return a hash on success", async () => {
		const { sut } = makeSut()

		const hashsPassword = await sut.encrypt("any_value")
		expect(hashsPassword).toBe("hash")
	}),
])
