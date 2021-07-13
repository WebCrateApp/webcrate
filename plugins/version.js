export default ({ env }, inject) => {
	inject('version', () => {
		return env.appVersion
	})
}