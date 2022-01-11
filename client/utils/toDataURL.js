// Async wrapper around FileReader
const readFileAsync = (blob) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.onload = () => resolve(reader.result)
		reader.onerror = reject
		reader.readAsDataURL(blob)
	})
}

// Turn external image into base64 and ignore any errors
export const toDataURL = async (url) => {
	try {
		const res = await fetch(url)
		if (!res.ok) throw new Error(res.statusText)

		const blob = await res.blob()
		const dataUrl = await readFileAsync(blob)

		return dataUrl
	} catch (e) {
		return undefined
	}
}