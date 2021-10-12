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
		const { link, external, fullPage, crate, isPublic, newTab } = opts

		let newPath
		let newPage
		let newCrate

		// Switch to home page
		if (pageOrCrate === undefined || pageOrCrate === 'home') {
			newPage = 'home'
			newCrate = undefined
			newPath = '/'

		// Switch to inbox page
		} else if (pageOrCrate === 'inbox' || pageOrCrate === 'null') {
			newPage = undefined
			newCrate = 'null'
			newPath = `/inbox`

		// Open the link page
		} else if (fullPage) {
			newPage = undefined
			newCrate = crate || undefined

			// Use different path depending on the type of link
			if (isPublic) {
				newPath = `/link/public/${ pageOrCrate }`
			} else if (external) {
				newPath = `/link/${ pageOrCrate }?externalCrate=${ external }`
			} else {
				newPath = `/link/${ pageOrCrate }`
			}

		// Open a crate
		} else {
			newPage = undefined
			newCrate = pageOrCrate

			// Use different path depending on the type of crate
			if (isPublic) {
				newPath = `/crate/public/${ pageOrCrate }`
			} else if (external) {
				newPath = `/crate/external/${ pageOrCrate }`
			} else {
				newPath = `/crate/${ pageOrCrate }`
			}
		}

		// Open the link modal
		if (link !== undefined) {
			newPath += `/?link=${ link }`
		}

		// Open in new tab
		if (newTab) {
			window.open(newPath, '_blank')
			return
		}

		store.commit('SET_CURRENT_PAGE', newPage)
		store.commit('SET_CURRENT_CRATE', newCrate)

		app.router.push(newPath)
	})

	console.log('Looks like you are pretty curious, check out the code here: https://github.com/WebCrateApp/webcrate')
	console.log('Have a great day! 👨‍💻🦄')
}