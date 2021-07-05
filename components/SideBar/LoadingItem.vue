<template>
  <div class="loading-item" :style="{ '--height': height }">
    <span></span>
  </div>
</template>

<script>
export default {
	props: {
		height: {
			type: String,
			default: '40px'
		}
	}
}
</script>

<style lang="scss" scoped>
    .loading-item {
		width: 100%;
		height: var(--height);
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0.2rem 0;
        margin-top: 0.2rem;

		& span {
			background: var(--grey);
			border-radius: var(--border-radius);
			width: 100%;
			height: 100%;
			position: relative;
			overflow: hidden;

			&::before {
				content: '';
				display: block;
				position: absolute;
				left: -150px;
				top: 0;
				height: 100%;
				width: 150px;
				background: linear-gradient(to right, transparent 0%, var(--grey-light) 50%, transparent 100%);
				animation: load 1.2s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;

				@keyframes load {
					from {
						left: -150px;
					}
					to   {
						left: 100%;
					}
				}
			}
		}
	}
</style>