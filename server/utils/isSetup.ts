import { Config } from '../models/config'

export const isSetup = async () => {
	const config = await Config.get()

	if (!config || !config.name) {
		return false
	}

	return true
}