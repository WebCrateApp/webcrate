import Darkmode from 'drkmd-js'

export default ({ env, store, app }, inject) => {
	inject('clipboard', (value) => {
		// Create temporary element
		const tempElem = document.createElement('input')
		document.body.appendChild(tempElem)

		// Add the text which should be copied and select it
		tempElem.value = value
		tempElem.select()

		let copied = false
		try {
			copied = document.execCommand('copy')
		} catch (err) {
			copied = false
		}

		// Remove the element again
		document.body.removeChild(tempElem)

		return copied
	})

	const darkmode = new Darkmode()
	inject('darkmode', darkmode)

	inject('version', () => {
		return env.appVersion
	})

	inject('modal', {
		replace: (type, value) => {
			store.commit('modal/replace', {
				modal: type,
				data: value
			})
		},
		show: (type, value) => {
			store.commit('modal/show', {
				modal: type,
				data: value
			})
		},
		hide: (value) => {
			store.commit('modal/hide', value)
		},
		isShown: () => {
			return store.state.modal.show !== undefined
		},
		getShown: () => {
			return store.state.modal.show
		},
		setData: (data) => {
			store.commit('modal/set_data', data)
		},
		getData: () => {
			return store.state.modal.data
		}
	})

	inject('switchToPageOrCrate', (pageOrCrate, opts = {}) => {
		const { link, external } = opts

		let newPath
		if (pageOrCrate === undefined || pageOrCrate === 'home') {
			store.commit('SET_CURRENT_PAGE', 'home')
			store.commit('SET_CURRENT_CRATE', undefined)
			newPath = '/'
		} else if (pageOrCrate === 'inbox' || pageOrCrate === 'null') {
			store.commit('SET_CURRENT_PAGE', undefined)
			store.commit('SET_CURRENT_CRATE', 'null')
			newPath = `/inbox`
		} else {
			store.commit('SET_CURRENT_PAGE', undefined)
			store.commit('SET_CURRENT_CRATE', pageOrCrate)
			newPath = `/crate${ external ? '/external' : '' }/${ pageOrCrate }`
		}

		if (link !== undefined) {
			newPath += `?link=${ link }`
		}

		app.router.push(newPath)
	})
}