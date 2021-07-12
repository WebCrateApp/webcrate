export default ({ store }, inject) => {
	inject('modal', {
		show: (type, value) => {
			store.dispatch('SHOW_MODAL', {
				modal: type,
				show: true,
				value
			})
		},
		hide: (type, value) => {
			store.dispatch('SHOW_MODAL', {
				modal: type,
				show: false,
				value
			})
		},
		set: (type, show, value) => {
			store.dispatch('SHOW_MODAL', {
				modal: type,
				show,
				value
			})
		}
	})
}