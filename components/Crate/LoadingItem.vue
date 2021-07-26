<template>
  <div class="crate-item">
    <LoadingItem height="22px" width="90%" />
    <LoadingItem height="20px" width="20%" />
  </div>
</template>

<script>
export default {

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