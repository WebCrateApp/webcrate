<template>
  <div class="crate-item">
    <p><span>{{ emojiIcon }}</span>{{ name }}</p>
  </div>
</template>

<script>
import emojis from '@/../server/utils/emojis'

export default {
	// eslint-disable-next-line vue/require-prop-types
	props: {
		icon: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		}
	},
	computed: {
		emojiIcon() {
			return emojis[this.icon]
		}
	}
}
</script>

<style lang="scss" scoped>
    .crate-item {
        padding: 0.5rem;
        border-radius: var(--border-radius);
        transition: background .2s ease;
        cursor: pointer;

        & span {
            margin-right: 0.5rem;
        }

        &:hover {
            background: var(--background-2nd);
            transition: none;
        }
    }
</style>