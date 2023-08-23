import Vue from 'vue'
import promptModal from '@/components/Modal/Prompt.vue'

import { events } from './events'

const Prompt = {
	install(Vue) {
		if (this.installed) {
			return
		}

		this.installed = true

		Vue.component('PromptModal', promptModal)

		const defaultOps = {
			title: 'Enter a value',
			message: undefined,
			confirmText: 'Okay',
			cancelText: 'Cancel',
			value: undefined,
			placeholder: 'value'
		}

		const prompt = (options) => {
			const promise = new Promise((resolve, reject) => {
				try {
					const opts = Object.assign({}, defaultOps, options)

					events.$emit('open', opts)

					events.$on('done', (val) => {
						resolve(val)
					})
				} catch (err) {
					reject(err)
				}
			})

			return promise
		}

		Vue.prototype.$prompt = prompt
		Vue.$prompt = prompt
	}
}

Vue.use(Prompt)