/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
declare module 'nuxt'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace Express {
	export interface Response {
		ok: (data?: any) => void,
		fail: (statusCode: number, error?: any, statusMessage?: string) => void
	}

	export interface Request {
		paginate?: {
			limit: number
			last?: string
		}
	}
 }