export class MissingParamErro extends Error {
	constructor(paramName: string) {
		super(`Missing param: ${paramName}`)
		this.name = paramName
	}
}
