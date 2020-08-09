import { HttpResponse } from "../protocols/IHttp"
import { ServerError } from "../erros"

export const badRequest = (error: Error): HttpResponse => {
	return {
		statusCode: 400,
		body: error,
	}
}

export const serverError = (error: Error): HttpResponse => {
	return {
		statusCode: 500,
		body: new ServerError(error.stack),
	}
}

export const success = (data: any): HttpResponse => {
	return {
		statusCode: 200,
		body: data,
	}
}
