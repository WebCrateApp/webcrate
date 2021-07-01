export default {
	OK: 200,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	TOO_MANY_REQUESTS: 429,
	SERVER_ERROR: 500
}

export const messages: { [key: number]: string; } = {
	200: 'ok',
	400: 'bad request',
	401: 'unauthorized',
	403: 'forbidden',
	404: 'not found',
	409: 'conflict',
	429: 'too many requests',
	500: 'server error'
}