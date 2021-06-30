import { Response } from 'express'

export function success(res: Response, data: any) {
	res.json({
		status: 200,
		message: 'ok',
		data
	})
}

export function error(res: Response, error: any, status: number) {
	res.json({
		status: status || 400,
		error
	})
}