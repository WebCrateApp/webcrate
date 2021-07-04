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