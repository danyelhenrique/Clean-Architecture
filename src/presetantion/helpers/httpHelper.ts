import { HttpResponse } from "../protocols/IHttp"
import { ServerError } from "../erros/serverError"

export const badRequest = (error: Error): HttpResponse => {
	return {
		statusCode: 400,
		body: error,
	}
}

export const serverError = (): HttpResponse => {
	return {
		statusCode: 500,
		body: new ServerError(),
	}
}

export const success = (data: any): HttpResponse => {
	return {
		statusCode: 200,
		body: data,
	}
}
