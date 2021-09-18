<template>
  <div class="grid" :style="{ '--grid-max-width': maxWidth }">
    <slot></slot>
  </div>
</template>

<script>
export default {
	props: {
		maxWidth: {
			type: String,
			default: '350px'
		}
	}
}

</script>

<style lang="scss" scoped>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--grid-max-width), 1fr));
		grid-gap: 1rem;
	}

	@media only screen and (max-width: 400px) {
		.grid {
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		}
	}

</style>