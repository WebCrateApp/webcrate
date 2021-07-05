<template>
  <div class="container">
    <h1>{{ emojiIcon }} {{ crate.name }}</h1>
  </div>
</template>

<script>
import emojis from '../../server/utils/emojis'

export default {
	layout: 'sidebar',
	async asyncData({ params, $axios, redirect, store }) {
		const crateId = params.id

		const { data: res } = await $axios.get(`/api/crate?id=${ crateId }`)

		const data = res.data
		if (!data) {
			return redirect('/home')
		}

		store.commit('SET_CURRENT_CRATE', data)

		return { crate: data }
	},
	computed: {
		emojiIcon() {
			return emojis[this.crate.icon]
		}
	}
}

</script>

<style lang="scss" scoped>

</style>