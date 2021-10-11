<template>
  <div class="link-item">
    <p>{{ title }}</p>
    <div class="right">
      <Img v-if="icon" :src="loadExternalIcon ? icon : `/img/${ id }?type=icon`" />
      <p class="domain">
        {{ domain }}
      </p>
      <p v-if="crate" class="crate">
        - {{ emojiIcon }} {{ crate.name }}
      </p>
    </div>
  </div>
</template>

<script>
import emojis from '@/../server/utils/emojis'

export default {
	// eslint-disable-next-line vue/require-prop-types
	props: {
		id: {
			type: String,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		url: {
			type: String,
			required: true
		},
		icon: {
			type: String,
			default: undefined
		},
		crate: {
			type: Object,
			default: undefined
		},
		loadExternalIcon: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		emojiIcon() {
			return emojis[this.crate.icon]
		},
		domain() {
			try {
				return new URL(this.url).host
			} catch (err) {
				return undefined
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.link-item {
		padding: 0.5rem;
		border-radius: var(--border-radius);
		transition: background .2s ease;
		cursor: pointer;
		padding-left: 1rem;

		.right {
			display: flex;
			align-items: center;
		}

		& img {
			width: 15px;
			height: 15px;
			margin-right: 0.5rem;
		}

		.domain {
			color: var(--text-light);
		}

		.crate {
			color: var(--text-light);
			margin-left: 0.5rem;
		}

		&:hover {
			background: var(--background-2nd);
			transition: none;
		}
	}
</style>