import { URL } from 'url'

export const isValidUrl = (url: string) => {
	try {
		// eslint-disable-next-line no-new
		new URL(url)
		return true
	} catch (err) {
		return false
	}
}

export const parseUrl = (rawUrl: string) => {
	const withProtocol = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ? rawUrl : `https://${ rawUrl }`

	return new URL(withProtocol).toString()
}