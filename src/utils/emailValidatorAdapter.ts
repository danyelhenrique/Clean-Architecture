import { IEmailValidador } from "../presetantion/protocols/IEmaiValidator"

import validator from "validator"

export class EmailValidatorAdapter implements IEmailValidador {
	isValid(email: string): boolean {
		return validator.isEmail(email)
	}
}
