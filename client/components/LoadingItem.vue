<template>
  <div class="loading-item" :class="{ 'loading': loading }" :style="{ '--height': height, '--width': width, '--padding': padding, '--background-color': background }">
    <span></span>
  </div>
</template>

<script>
export default {
	props: {
		height: {
			type: String,
			default: '40px'
		},
		width: {
			type: String,
			default: '100%'
		},
		background: {
			type: String,
			default: 'var(--grey)'
		},
		padding: {
			type: String,
			default: '0.2rem'
		},
		loading: {
			type: Boolean,
			default: true
		}
	}
}
</script>

<style lang="scss" scoped>
    .loading-item {
		width: var(--width);
		height: var(--height);
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: var(--padding) 0;
        margin-top: var(--padding);

		& span {
			background: var(--background-color);
			border-radius: var(--border-radius);
			width: 100%;
			height: 100%;
			position: relative;
			overflow: hidden;
		}

		&.loading {
			& span {
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
	}
</style>