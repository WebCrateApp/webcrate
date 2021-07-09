const { Deta } = require('deta')
require('dotenv').config()

const deta = Deta()

const Links = deta.Base('links')

const run = async () => {
	const res = await Links.fetch({}, { limit: 2 })

	console.log(res)
}

run()