<template>
  <div v-click-outside="close" class="emoji-picker-outer">
    <div class="emoji-picker-inner">
      <input v-model="search" class="input" placeholder="Search" />
      <span v-for="(emoji, key) in emojis" :key="key" :title="key" @click.stop="selectEmoji(key)">{{ emoji }}</span>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import emojis from '@/../server/utils/emojis'

export default {
	directives: {
		ClickOutside
	},
	data() {
		return {
			search: undefined
		}
	},
	computed: {
		emojis() {
			if (!this.search) return emojis
			const filterd = Object.keys(emojis).reduce((obj, key) => {
				if (key.includes(this.search)) {
					obj[key] = emojis[key]
				}

				return obj
			}, {})

			return filterd
		}
	},
	methods: {
		selectEmoji(key) {
			this.$emit('selected', key)
		},
		close() {
			this.$emit('close')
		}
	}
}
</script>

<style lang="scss" scoped>
    .emoji-picker-outer {
        max-width: 300px;
        width: 80%;
        overflow: hidden;
        border-radius: var(--border-radius);
        background: var(--background-2nd);
        border: 1px solid var(--grey);
    }

    .emoji-picker-inner {
        overflow-y: auto;
        padding: 0.5rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        max-height: 250px;

        & span {
            padding: 0.2rem;
            cursor: pointer;
            border-radius: var(--border-radius);
            border: 1px solid var(--background-2nd);
            transition: border .2s ease;

            &:hover {
                border: 1px solid var(--grey);
                transition: none;
            }
        }

        & input {
            margin-bottom: 0.5rem;
        }
    }
</style>