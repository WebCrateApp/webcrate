<template>
  <div class="menu-item" :class="{ 'selected': selected }">
    <div class="icon-wrapper">
      <div v-if="emoji" class="emoji">
        {{ emojiIcon }}
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
import emojis from '../../server/utils/emojis'

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
	},
	computed: {
		emojiIcon() {
			return emojis[this.emoji]
		}
	}
}
</script>

<style lang="scss" scoped>
	.menu-item {
		width: 100%;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0.5rem 0.8rem;
		margin-top: 0.2rem;
		background: var(--background-2nd);
		border: 2px solid var(--background-2nd);
		border-radius: var(--border-radius);
		box-sizing: border-box;
		transition: border .2s ease;
		cursor: pointer;

		&:hover {
			border: 2px solid var(--grey);
			transition: none;
		}
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