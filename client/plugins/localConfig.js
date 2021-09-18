export default (_context, inject) => {
	inject('storage', {
		get: (key, parse = false) => {
			const item = localStorage.getItem(key)

			if (item === null) {
				return undefined
			}

			if (parse) {
				return JSON.parse(item)
			}

			return item
		},
		set: (key, value) => {
			localStorage.setItem(key, value)
		},
		unset: (key) => {
			localStorage.removeItem(key)
		},
		reset: () => {
			localStorage.clear()
		},
		types: {
			SHOW_IMAGES_IN_LIST: 'SHOW_IMAGES_IN_LIST'
		}
	})
}