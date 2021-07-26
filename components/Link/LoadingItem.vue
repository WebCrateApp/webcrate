<template>
  <div>
    <div class="link-item">
      <LoadingItem height="20px" />
      <div class="domain-wrapper">
        <LoadingItem height="16px" width="70%" />
      </div>
      <LoadingItem height="16px" width="20%" />
    </div>
  </div>
</template>

<script>
export default {

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