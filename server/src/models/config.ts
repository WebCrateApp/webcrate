import db from '../service/db.js'

import { version } from '../utils/variables.js'

const Base = db.Base('config')

const get = async () => {
	const name = await Base.get('name')
	// const configVersion = await Base.get('version')

	// const storedVersion = configVersion?.value

	return {
		name: name?.value,
		version: version,
		didUpdate: false
	}
}

const set = (config: any) => {
	Object.entries(config).forEach(async ([ key, value ]) => {
		await Base.put(value as string, key as string)
	})
}

export const Config = {
	get,
	set
}