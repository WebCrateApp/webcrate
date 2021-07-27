import { Config } from '../models/config'

export const isSetup = async () => {
	const env = process.env.OVERWRITE_IS_SETUP

	if (env !== undefined) {
		return env === 'true'
	}

	const config = await Config.get()

	if (!config || !config.name) {
		return false
	}

	return true
}