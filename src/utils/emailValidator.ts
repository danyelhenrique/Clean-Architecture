import { IEmailValidador } from "../presetantion/protocols/IEmaiValidator"

export class EmailValidatorAdapter implements IEmailValidador {
	isValid(email: string): boolean {
		return false
	}
}
