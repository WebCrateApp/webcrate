/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path'

/* import { Deta } from 'deta'

const deta = Deta()

const db = deta.Base('test') */

const OfflineBase = (dir?: string) => {
	const storageLocation = dir || path.join(__dirname, '.offline-base')

	const Base = (name: string) => {

		const put = (data: any, key: string) => {
			return data
		}

		const get = (key: string) => {
			return key
		}

		const deleteMethod = (key: string) => {
			return key
		}

		const insert = (key: string) => {
			return key
		}

		const putMany = (key: string) => {
			return key
		}

		const update = (key: string) => {
			return key
		}

		const fetch = (key: string) => {
			return key
		}

		return {
			put,
			get,
			delete: deleteMethod,
			insert,
			putMany,
			update,
			fetch
		}
	}

	return Base
}

export default OfflineBase