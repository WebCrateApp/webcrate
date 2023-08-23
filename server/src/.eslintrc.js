/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
	...require('@betahuhn/config').eslintTypescript,
	rules: {
		...require('@betahuhn/config').eslintTypescript.rules,
		'no-tabs': 0,
		'no-console': 0,
		'padded-blocks': 0,
		'curly': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0
	}
}