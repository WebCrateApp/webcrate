import { nanoid, customAlphabet } from 'nanoid'
export const generateKey = () => {
	const id = nanoid(10)
	const timestamp = Date.now()

	return `${ timestamp }-${ id }`
}

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
export const generateId = customAlphabet(alphabet, 16)