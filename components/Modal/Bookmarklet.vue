<template>
  <Modal class="output-modal" @close="close">
    <h1>Bookmarklet</h1>
    <p>To add links to your WebCrate instance on mobile, copy the link below and save it as a bookmark. Name it something like "Save to WebCrate" and you're good to go.</p>
    <div class="link">
      <a :href="code">{{ code }}</a>
      <Icon :name="copyIcon" @click.native.stop="copy" />
    </div>
    <button v-shortkey="['enter']" class="primary-button" @click="copy" @shortkey="copy">
      Copy code
    </button>
  </Modal>
</template>

<script>
export default {
	data() {
		return {
			isOpen: false,
			copyIcon: 'clipboard'
		}
	},
	computed: {
		code() {
			const detaInstance = `${ window.location.protocol }//${ window.location.host }`

			const code = `javascript:(function(){window.open('${ detaInstance }?addUrl='+encodeURIComponent(location.href))})();`

			// const code2 = `javascript:source=location.href;void(t=open('${ detaInstance }?addUrl=' + encodeURIComponent(source)), 'WebCrate', 'toolbar=no,width=400,height=400'));t.blur();`

			return code
		}
	},
	methods: {
		copy() {
			this.copyIcon = 'check'
			this.$clipboard(this.code)
			this.$toast.success('Copied to clipboard!')
			setTimeout(() => {
				this.copyIcon = 'clipboard'
			}, 1000)
		},
		close() {
			if (!this.isOpen) {
				this.$modal.hide()
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.output-modal {
		& h1 {
			font-size: 1.2rem;
			margin-bottom: 1rem;
		}

        & .link {
            display: flex;
            align-items: center;
            padding: 1rem;
            background: var(--background-2nd);
            border-radius: var(--border-radius);
            margin-top: 1rem;
			position: relative;

            & p {
                user-select: all;
            }

            & div {
				position: absolute;
				bottom: 1rem;
				right: 1rem;
            }
        }

		& button {
			margin-top: 1rem;
		}
	}
</style>