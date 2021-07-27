export default ({ store }, inject) => {
	inject('modal', {
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
}