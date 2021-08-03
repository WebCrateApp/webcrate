import express from 'express'

import log from '../utils/log'
import { messages } from '../utils/status'
import { isSetup } from '../utils/isSetup'

import { Crate } from '../models/crate'
import { Stat } from '../models/stats'

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

export function disableCaching(req: express.Request, res: express.Response, next: express.NextFunction) {
	if (req.originalUrl === '/') {
		res.set('Cache-control', 'no-store')
	}

	next()
}

export async function checkIfSetup(req: express.Request, res: express.Response, next: express.NextFunction) {
	// Check if WebCrate already set up
	const setup = await isSetup()
	if (!setup) {

		log.debug('not setup yet')

		// Create default crates if they don't exist
		const crates = await Crate.find([{ name: 'Read Later' }, { name: 'Archive' }])
		if (crates.count === 0) {
			log.debug('creating default crates')
			const crate1 = await Crate.create('Read Later', 'Articles and blog posts I want to read later', 'book', false)
			const crate2 = await Crate.create('Archive', 'Archive of old links', 'open_file_folder', false)

			await Stat.addRecentlyUsedCrate(crate1.id)
			await Stat.addRecentlyUsedCrate(crate2.id)
		}

		// Redirect to welcome page
		if (req.path === '/' || req.path === '/inbox' || req.path.startsWith('/crate')) {
			log.debug('redirecting to welcome page')
			return res.redirect('/welcome')
		}

		return next()
	}

	// Block welcome page if already set up
	if (req.path === '/welcome') {
		return res.redirect('/')
	}

	return next()
}

export function sendResponse(_req: express.Request, res: express.Response, next: express.NextFunction) {
	res.ok = (data?: any) => {
		res.json({
			status: 200,
			message: 'ok',
			...(data && data.last && { last: data.last }),
			...(data && data.count && data.items ? { data: data.items } : { data })
		})
	}

	res.fail = (statusCode: number, err?: any, statusMessage?: string) => {
		const status = statusCode || 500
		const message = messages[statusCode]

		let error

		if (!err) {
			error = { message: statusMessage || 'Unkown error ocurred' }
		} else if (typeof err === 'string') {
			error = { message: err }
		} else if (!err.message || statusMessage !== undefined) {
			error = {
				...err,
				message: statusMessage || 'Unkown error ocurred'
			}
		} else {
			error = err
		}

		res.status(status).json({
			status,
			message,
			error
		})
	}

	next()
}

export function parsePaginate(req: express.Request, _res: express.Response, next: express.NextFunction) {
	const rawLimit = req.query.limit as string | undefined
	const last = req.query.last as string | undefined

	if (!rawLimit) {
		req.paginate = {
			last,
			limit: 20
		}

		return next()
	}

	if (rawLimit === '0') {
		return next()
	}

	req.paginate = {
		last,
		limit: parseInt(rawLimit)
	}

	next()
}