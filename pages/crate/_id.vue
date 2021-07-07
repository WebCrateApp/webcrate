<template>
  <div class="crate-wrapper">
    <div class="top-section">
      <div class="title">
        <h1>{{ emojiIcon }} <input v-model="crateName" placeholder="Crate Title" class="no-input headline"></h1>
        <input v-model="crateDescription" class="no-input subtext" placeholder="Click to add a description for this Crate" />
      </div>
      <div class="actions">
        <button class="button add-btn" @click.stop="showAddLinkModal">
          <Icon name="add" />Add Link
        </button>
        <button class="button">
          <Icon name="dotsV" />
        </button>
      </div>
    </div>
    <hr>
    <div class="links">
      <LinkGrid>
        <LinkGridItem v-for="link in links" :key="link.key" :link="link" />
      </LinkGrid>
    </div>
  </div>
</template>

<script>
import emojis from '../../server/utils/emojis'

export default {
	layout: 'sidebar',
	async asyncData({ params, $axios, redirect, store }) {
		const crateId = params.id

		const { data: res } = await $axios.get(`/api/crate/${ crateId }`)

		const crate = res.data
		if (!crate) {
			return redirect('/home')
		}

		store.commit('SET_CURRENT_CRATE', crate.key)

		store.dispatch('GET_LINKS_FOR_CRATE', crate.key)

		return { crate }
	},
	computed: {
		emojiIcon() {
			return emojis[this.crate.icon]
		},
		links() {
			return this.$store.state.currentCrateLinks
		},
		crateDescription: {
			set(value) {
				this.$store.dispatch('CHANGE_CRATE_DESCRIPTION', { crateId: this.crate.key, description: value })
			},
			get() {
				return this.crate.description
			}
		},
		crateName: {
			set(value) {
				this.$store.dispatch('CHANGE_CRATE_NAME', { crateId: this.crate.key, name: value })
			},
			get() {
				return this.crate.name
			}
		}
	},
	methods: {
		showAddLinkModal() {
			this.$store.commit('SET_SHOW_MODAL', { modal: 'addLink', value: true })
		}
	}
}

</script>

<style lang="scss" scoped>
	.crate-wrapper {
		padding: 2rem;

		& hr {
			margin-top: 0.5rem;
		}
	}

	.top-section {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.title {
		flex-grow: 1;

		& h1 {
			display: flex;
			align-items: center;
			font-size: 1.3rem;
		}

		.headline {
			font-size: 1.3rem;
			font-weight: 600;
			color: var(--text);
			flex-grow: 1;
			margin-left: 0.5rem;
		}

		.subtext {
			font-size: 0.9rem;
			margin-top: 0.3rem;
			color: var(--text-light);
			width: 100%;
		}
	}

	.actions {
		margin-left: auto;
		display: flex;
		align-items: center;

		& button {
			display: flex;
			align-items: center;
		}
	}

	.add-btn {
		margin-right: 1rem;

		& div {
			margin-right: 0.5rem;
		}
	}

	.links {
		margin-top: 1rem;
	}

	.add-modal {
		& h1 {
			font-size: 1.2rem;
			margin-bottom: 1rem;
		}

		& input {
			margin-bottom: 1rem;
		}

		& button {
			display: flex;
			align-items: center;

			& div {
				margin-right: 0.3rem;
				margin-left: -3px;
			}
		}

		& .error {
			margin-top: 0.5rem;
			color: var(--text-light);
		}
	}
</style>