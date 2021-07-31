const { Deta } = require('deta')

require('dotenv').config()

const db = Deta()

const base = db.Base('links')

const find = async (query: any = {}, limit?: number, last?: string) => {
	let res = await base.fetch(query, limit ? { limit, last } : undefined)
	let items: Array<any> = res.items

	// We already have enough data
	if (limit && items.length === limit) return { items, count: items.length, last: res.last }

	// More data available
	while (res.last) {
		res = await base.fetch(query, {
			// If we have a limit set we only need to get the remaining items
			...(limit) && { limit: limit - items.length },

			// Since the last item
			last: res.last
		})

		items = items.concat(items)
	}

	// We have everything
	return { items, count: items.length, last: res.last }
}

const run = async () => {
	const first = await find({}, 2)

	console.log(first)

	const second = await find({}, 2, first.last)

	console.log(second)
}

run()