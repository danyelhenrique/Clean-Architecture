export class InvalidParamErro extends Error {
	constructor(paramName: string) {
		super(`Missing param: ${paramName}`)
		this.name = "InvalidParamError"
	}
}
