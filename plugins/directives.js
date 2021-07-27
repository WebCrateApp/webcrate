import Vue from 'vue'

Vue.directive('focus', {
	inserted: (el) => {
		// Focus the element
		el.focus()
	}
})