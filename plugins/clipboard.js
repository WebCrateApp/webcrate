export default (_context, inject) => {
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
}