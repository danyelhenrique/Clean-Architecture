import bcrypt from "bcrypt"
import { BcryptAdater } from "./bcryptAdapter"

jest.mock("bcrypt", () => {
	return {
		async hash(): Promise<string> {
			return Promise.resolve("hash")
		},
	}
})

describe("Bcrypt Adaper", () => [
	test("Should call bcrypt with correct values", async () => {
		const salt = 12
		const sut = new BcryptAdater({ salt })
		const hasSpy = jest.spyOn(bcrypt, "hash")

		await sut.encrypt("any_value")
		expect(hasSpy).toHaveBeenCalledWith("any_value", salt)
	}),

	test("Should return a hash on success", async () => {
		const salt = 12
		const sut = new BcryptAdater({ salt })

		const hashsPassword = await sut.encrypt("any_value")
		expect(hashsPassword).toBe("hash")
	}),
])
