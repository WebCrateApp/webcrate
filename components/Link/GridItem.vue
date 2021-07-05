<template>
  <a :href="link.url" target="_blank" rel="noopener">
    <div class="link-item">
      <h4>{{ link.meta && link.meta.title }}</h4>
      <p>{{ domain }}</p>
      <span>{{ new Date(link.addedAt).toLocaleString() }}</span>
    </div>
  </a>
</template>

<script>
export default {
	// eslint-disable-next-line vue/require-prop-types
	props: [ 'link' ],
	computed: {
		domain() {
			return new URL(this.link.url).host
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

		& span {
			color: var(--text-light);
			display: block;
			font-size: 0.9rem;
		}

		&:hover {
			border: 2px solid var(--grey);
			transition: none;
		}
	}
</style>