import { nanoid, customAlphabet } from 'nanoid'

// Used as large number to make sure keys are generated in descending order
const maxDateNowValue = 8.64e15 // Fun fact: This will only work until the year 275760

export const generateKey = (descending: boolean) => {
	const id = nanoid(10)
	const timestamp = descending ? maxDateNowValue - Date.now() : Date.now()

	return `${ timestamp }-${ id }`
}

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
export const generateId = customAlphabet(alphabet, 16)