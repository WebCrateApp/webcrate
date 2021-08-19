<template>
  <nuxt-link :to="`/crate/${ crate.id }`" @click.native="resetPage">
    <div class="crate-item">
      <h4>{{ emojiIcon }} {{ crate.name }}</h4>
      <span>{{ crate.numLinks }} Links</span>
    </div>
  </nuxt-link>
</template>

<script>
import emojis from '@/../server/utils/emojis'

export default {
	// eslint-disable-next-line vue/require-prop-types
	props: [ 'crate' ],
	computed: {
		emojiIcon() {
			return emojis[this.crate.icon]
		}
	},
	methods: {
		resetPage() {
			this.$store.commit('SET_CURRENT_PAGE', undefined)
		}
	}
}
</script>

<style lang="scss" scoped>
	.crate-item {
		border-radius: var(--border-radius);
		padding: 1rem;
		background: var(--background-2nd);
		border: 2px solid var(--background-2nd);
		transition: border .2s ease;
		cursor: pointer;
		position: relative;

		& span {
			color: var(--text-light);
			display: block;
			font-size: 0.9rem;
			margin-top: 0.5rem;
		}

		&:hover {
			border: 2px solid var(--grey);
			transition: none;
		}
	}
</style>