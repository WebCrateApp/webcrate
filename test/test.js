const { Deta } = require('deta')
require('dotenv').config()

const deta = Deta()

const Links = deta.Base('links')

const run = async () => {
	const items = [
		{
			id: 'EBpEa9zZ5EaZONLI',
			key: '1625838003065-E8wkjJQFov'
		},
		{
			id: 'qO6w8S6VaPEAFm1i',
			key: '1625838024218-Hl-iRvNdpX'
		},
		{
			id: '8lPxJEJXdPOcOADw',
			key: '1625838028096-8n_YrTuXol'
		},
		{
			id: '61Rh33uNjpRBDRrR',
			key: '1625845557872-mBL63D5U_k'
		},
		{
			id: 'aVSyul1kloPrPzOy',
			key: '1625845682193-RZ83T2Ez5d'
		},
		{
			id: 'b4BetFIFcJdcAVqA',
			key: '1625846313738-Dl_DN8kxF0'
		}
	]

	const testFetch = async (id) => {
		const startTime = Date.now()
		await Links.fetch({ id })
		const endTime = Date.now()
		return (endTime - startTime)
	}

	const testGet = async (key) => {
		const startTime = Date.now()
		await Links.get(key)
		const endTime = Date.now()
		return (endTime - startTime)
	}

	const sleep = (ms) => {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	const result = await Promise.all(items.map(async (item) => {
		const fetch = await testFetch(item.id)
		const get = await testGet(item.key)

		await sleep(1000)

		return {
			fetch,
			get
		}
	}))

	// console.log(result)

	const avgFetch = Math.round(result.reduce((sum, item) => sum + item.fetch, 0) / result.length)
	const avgGet = Math.round(result.reduce((sum, item) => sum + item.get, 0) / result.length)

	console.log(`Avg fetch: ${ avgFetch } ms`)
	console.log(`Avg get: ${ avgGet } ms`)
}

run()