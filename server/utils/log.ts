import { Signale } from 'signale'

export default new Signale({
	scope: 'WebCrate',
	logLevel: process.env.LOG_LEVEL || 'info',
	types: {
		success: {
			badge: '✔',
			color: 'green',
			label: 'success',
			logLevel: 'debug'
		},
		info: {
			badge: 'ℹ️',
			color: 'blue',
			label: 'info',
			logLevel: 'debug'
		},
		request: {
			badge: '->',
			color: 'gray',
			label: 'request',
			logLevel: 'debug'
		},
		debug: {
			badge: '🐛',
			color: 'cyan',
			label: 'debug',
			logLevel: 'info'
		}
	}
})