import Vue from 'vue'
import confirmModal from '@/components/Modal/ConfirmAction.vue'

import { events } from './events'

const Confirm = {
	install(Vue) {
		if (this.installed) {
			return
		}

		this.installed = true

		Vue.component('ConfirmModal', confirmModal)

		const defaultOps = {
			title: 'Are you sure?',
			message: 'This action cannot be undone. Choose wisely 🔮',
			confirmText: 'Confirm',
			cancelText: 'Cancel'
		}

		const confirm = (options) => {
			const promise = new Promise((resolve, reject) => {
				try {
					const opts = Object.assign({}, defaultOps, options)

					events.$emit('open', opts)

					events.$on('confirmed', (val) => {
						resolve(val)
					})
				} catch (err) {
					reject(err)
				}
			})

			return promise
		}

		Vue.prototype.$confirm = confirm
		Vue.$confirm = confirm
	}
}

Vue.use(Confirm)