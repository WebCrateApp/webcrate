<template>
  <div class="menu-item" :class="{ 'selected': selected }">
    <div class="icon-wrapper">
      <div v-if="emoji" class="emoji">
        {{ emoji }}
      </div>
      <Icon v-else-if="icon" :name="icon" class="icon" />
    </div>
    <span>{{ name }}</span>
    <div v-if="count" class="count">
      <span>{{ count }}</span>
    </div>
  </div>
</template>

<script>
export default {
	props: {
		name: {
			type: String,
			required: true
		},
		selected: {
			type: Boolean,
			default: false
		},
		count: {
			type: Number,
			default: undefined
		},
		emoji: {
			type: String,
			default: undefined
		},
		icon: {
			type: String,
			default: undefined
		}
	}
}
</script>

<style lang="scss" scoped>
	.menu-item {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0.5rem 0.8rem;
		background: var(--background-2nd);
		border-radius: var(--border-radius);
		cursor: pointer;
	}

	.selected {
		background: var(--grey);
	}

	.icon-wrapper {
		margin-right: 0.3rem;
		width: 25px;
	}

	.count {
		margin-left: auto;
		display: flex;
		justify-content: center;
		align-items: center;

		& span {
			font-size: 0.8rem;
		}
	}
</style>