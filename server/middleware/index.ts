import express from 'express'
import log from '../utils/log'

const ignoreRequestStrings: Array<string> = [ 'js/', 'css/', 'img/', 'static/', '_nuxt', 'manifest.json' ] // Don't log request if one of the strings are in URL

export function routeLog(req: express.Request, _res: express.Response, next: express.NextFunction) {
	if (ignoreRequestStrings.some((value) => req.originalUrl.includes(value)) || req.method === 'HEAD') {
		return next()
	}
	const dateOb = new Date()
	const date = ('0' + dateOb.getDate()).slice(-2)
	const month = ('0' + (dateOb.getMonth() + 1)).slice(-2)
	const year = dateOb.getFullYear()
	const hours = dateOb.getHours()
	const minutes = dateOb.getMinutes()
	const seconds = dateOb.getSeconds()
	const time = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds
	log.request(`${ time } ${ req.method } ${ req.originalUrl }`)
	next()
}

export function sendResponse(_req: express.Request, res: express.Response) {
	res.ok = (data: any) => {
		res.json({
			status: 200,
			message: 'ok',
			data
		})
	}

	res.fail = (data: any, statusCode?: number, message?: string) => {
		const status = statusCode || 500

		res.status(status).json({
			status,
			message: message || 'Error ocurred',
			data
		})
	}
}