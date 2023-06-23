import { CardType, createActions, DetailCard, Inputs, ListCard } from 'deta-space-actions'
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
	card: CardType.DETAIL,
	handler: async (event): Promise<DetailCard> => {
		const { url, title } = event
		const link = await createLink(url, title)
		return {
			title: link?.meta?.title,
			text: link?.meta?.description || link.url,
			image_url: link?.meta?.image,
			url: link.url,
			ref: `https://${ domain }/link/${ link.id }`
		}
	}
})

actions.add<{ crate?: string }>({
	name: 'links',
	title: 'List Links',
	input: [
		Inputs('crate').String().Optional()
	],
	card: CardType.LIST,
	handler: async (event): Promise<ListCard> => {
		const { crate: crateName } = event
		if (!crateName) {
			const links = await Link.find({}, 20, undefined)
			return {
				title: `Recent Links`,
				items: links.items.map(link => ({
					title: link?.meta?.title || link.url,
					description: link?.meta?.description,
					url: link.url,
					card: {
						type: CardType.DETAIL,
						data: {
							title: link?.meta?.title,
							text: link?.meta?.description,
							image_url: link?.meta?.image,
							url: link.url,
							ref: `https://${ domain }/link/${ link.id }`
						}
					}
				})) as any
			}
		}
		const crate = await Crate.findOne({ name: crateName })
		if (!crate) return {
			title: `Crate not found`,
			items: []
		}

		const links = await Link.find({ crate: crate.id }, 20, undefined)

		return {
			title: crate.name,
			description: crate.description,
			items: links.items.map(link => ({
				title: link?.meta?.title || link.url,
				description: crate.name,
				url: link.url,
				card: {
					type: CardType.DETAIL,
					data: {
						title: link?.meta?.title,
						text: link?.meta?.description,
						image_url: link?.meta?.image,
						url: link.url,
						ref: `https://${ domain }/link/${ link.id }`
					}
				}
			})) as any
		}
	}
})

actions.add({
	name: 'crates',
	title: 'List Crates',
	input: [],
	card: CardType.LIST,
	handler: async (): Promise<ListCard> => {
		const crates = await Crate.find({}, 20, undefined)
		return {
			title: `Crates`,
			items: crates.items.map(crate => ({
				title: crate.name,
				description: crate.description,
				url: `https://${ domain }/crate/${ crate.name }`,
				card: {
					type: CardType.DETAIL,
					data: {
						title: crate.name,
						text: crate.description,
						url: `https://${ domain }/crate/${ crate.name }`,
						ref: `https://${ domain }/crate/${ crate.name }`,
					}
				}
			})) as any
		}
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