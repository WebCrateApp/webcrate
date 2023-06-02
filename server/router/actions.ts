import { createActions, Inputs } from 'deta-space-actions'
import { createLink } from '../service/link.js'
import { Link } from '../models/link.js'
import { domain } from '../utils/variables.js'
import { Crate } from '../models/crate.js'

const actions = createActions()

actions.add<{ title?: string, url: string }>({
	name: 'add',
	title: 'Add Link',
	input: [
		Inputs('url').String(),
		Inputs('title').String().Optional()
	],
	handler: async (event) => {
		const { url, title } = event
		const link = await createLink(url, title)
		return `https://${ domain }/link/${ link.id }`
	}
})

actions.add<{ crate?: string }>({
	name: 'links',
	title: 'List Links',
	input: [
		Inputs('crate').String().Optional()
	],
	handler: async (event) => {
		const { crate: crateName } = event
		if (!crateName) {
			const links = await Link.find({}, 20, undefined)
			return links.items.map(link => ({
				title: link?.meta?.title,
				url: link.url
			}))
		}
		const crate = await Crate.findOne({ name: crateName })
		if (!crate) return 'Crate not found'

		const links = await Link.find({ crate: crate.id }, 20, undefined)
		return links.items.map(link => ({
			title: link?.meta?.title,
			url: link.url,
			crate: crate.name
		}))
	}
})

actions.add({
	name: 'crates',
	title: 'List Crates',
	input: [],
	handler: async () => {
		const crates = await Crate.find({}, 20, undefined)
		return crates.items.map(crate => ({
			name: crate.name,
			description: crate.description,
			icon: crate.icon,
			public: crate.public
		}))
	}
})

actions.add({
	name: 'inbox',
	title: 'Open Inbox',
	input: [],
	handler: () => {
		return `https://${ domain }/inbox`
	}
})

export default actions