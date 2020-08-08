import bcrypt from "bcrypt"
import { BcryptAdater } from "./bcryptAdapter"

describe("Bcrypt Adaper", () => [
	test("Should call bcrypet with correct values", async () => {
		const salt = 12
		const sut = new BcryptAdater({ salt })
		const hasSpy = jest.spyOn(bcrypt, "hash")

		await sut.encrypt("any_value")
		expect(hasSpy).toHaveBeenCalledWith("any_value", salt)
	}),
])
