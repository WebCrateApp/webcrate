import Vue from 'vue'

Vue.directive('focus', {
	inserted: (el) => {
		// Focus the element
		el.focus()
	}
})

Vue.directive('longpress', {
	bind(el, binding, vNode) {
		// Make sure expression provided is a function
		if (typeof binding.value !== 'function') {
			// Fetch name of component
			const compName = vNode.context.name
			// pass warning to console
			let warn = `[longpress:] provided expression '${ binding.expression }' is not a function, but has to be`
			if (compName) { warn += `Found in component '${ compName }' ` }

			console.warn(warn)
		}

		// Define variable
		let pressTimer = null
		const timeout = 1500

		// Define funtion handlers
		// Create timeout
		const start = (e) => {
			if (e.type === 'click' && e.button !== 0) {
				return
			}

			if (pressTimer === null) {
				pressTimer = setTimeout(() => {
					// Run function
					handler()
				}, timeout)
			}
		}

		// Cancel Timeout
		const cancel = () => {
			// Check if timer has a value or not
			if (pressTimer !== null) {
				clearTimeout(pressTimer)
				pressTimer = null
			}
		}

		// Run Function
		const handler = (e) => {
			binding.value(e)
		}

		// Add Event listeners
		el.addEventListener('mousedown', start)
		el.addEventListener('touchstart', start)

		// Cancel timeouts if this events happen
		el.addEventListener('click', cancel)
		el.addEventListener('mouseout', cancel)
		el.addEventListener('mouseup', cancel)
		el.addEventListener('touchend', cancel)
		el.addEventListener('touchleave', cancel)
		el.addEventListener('touchcancel', cancel)
	}
})