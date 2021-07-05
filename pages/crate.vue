<template>
  <div class="container">
    <h1>{{ emojiIcon }} {{ currentCrate.name }}</h1>
  </div>
</template>

<script>
import emojis from '../server/utils/emojis'

export default {
	layout: 'sidebar',
	computed: {
		currentCrate() {
			return this.$store.state.currentCrate
		},
		emojiIcon() {
			return emojis[this.currentCrate.icon]
		}
	}
}

</script>

<style lang="scss" scoped>

</style>