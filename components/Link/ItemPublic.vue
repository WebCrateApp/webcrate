<template>
  <div @click.stop="openLinkDetails">
    <div class="link-item" @mouseover="hover = true" @mouseleave="hover = false">
      <h4>{{ link.meta && link.meta.title }}</h4>
      <div class="domain-wrapper">
        <img v-if="link.meta && link.meta.icon" :src="`/img/${ link.id }?type=icon`">
        <p>{{ domain }}</p>
      </div>
      <span>{{ new Date(link.addedAt).toLocaleString() }}</span>
      <a :href="link.url" target="_blank" rel="noopener" @click.stop>
        <Icon v-if="hover" name="externalLink" class="delete-icon" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
	// eslint-disable-next-line vue/require-prop-types
	props: [ 'link' ],
	data() {
		return {
			hover: false
		}
	},
	computed: {
		domain() {
			return new URL(this.link.url).host
		}
	},
	methods: {
		openLinkDetails() {
			this.$modal.show('linkDetailsPublic', { link: this.link.id })
		}
	}
}
</script>

<style lang="scss" scoped>
	.link-item {
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
		}

		&:hover {
			border: 2px solid var(--grey);
			transition: none;
		}

		.domain-wrapper {
			display: flex;
			align-items: center;

			& img {
				width: 15px;
				height: 15px;
				margin-right: 0.3rem;
			}
		}
	}

	.delete-icon {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
		color: var(--text-light);
	}
</style>