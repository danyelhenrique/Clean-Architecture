import bcrypt from "bcrypt"

import { IEncrypter } from "../../data/protocols/encrypter"

export class BcryptAdater implements IEncrypter {
	private readonly salt: number
	constructor({ salt }: { salt: number }) {
		this.salt = salt
	}

	async encrypt(value: string): Promise<string> {
		const hash_password = await bcrypt.hash(value, this.salt)
		return hash_password
	}
}
