import db from '../service/db'

const Base = db.Base('config')

const get = async () => {
	const name = await Base.get('name')

	return {
		name: name?.value
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