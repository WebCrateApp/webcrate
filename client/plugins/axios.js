export default function({ $axios, redirect }) {
	$axios.onError((error) => {
		const loginUrl = process.client ? `https://deta.space/auth?redirect_uri=${ window.location.toString() }` : `https://deta.space/library?open=webcrate`
		const code = parseInt(error.response && error.response.status)
		if (code === 403) {
			return redirect(loginUrl)
		}
	})
}