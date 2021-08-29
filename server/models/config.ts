import db from '../service/db'
import pkg from '../../package.json'

const Base = db.Base('config')

const get = async () => {
	const name = await Base.get('name')
	const configVersion = await Base.get('version')

	const version = pkg.version
	const storedVersion = configVersion?.value

	return {
		name: name?.value,
		version: version,
		didUpdate: storedVersion !== version
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