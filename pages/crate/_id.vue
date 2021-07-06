<template>
  <div class="crate-wrapper">
    <Modal v-if="showAddModal" class="add-modal" @close="showAddModal = false">
      <h1>Add a new Link</h1>
      <input v-model="newLink" class="input" :class="{ 'input-invalid': invalidLinkErr }" placeholder="https://piedpiper.com">
      <button class="primary-button" @click="addLink">
        <Icon name="add" />Add Link
      </button>
      <p v-if="invalidLinkErr" class="error">
        Error: {{ invalidLinkErr }}
      </p>
    </Modal>
    <div class="top-section">
      <div class="title">
        <h2>{{ emojiIcon }} {{ crate.name }}</h2>
        <p v-if="crate.description">
          {{ crate.description }}
        </p>
        <p v-else>
          Click to add a description for this Crate.
        </p>
      </div>
      <div class="actions">
        <button class="button add-btn" @click.stop="showAddModal = true">
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
		const { data: res2 } = await $axios.get(`/api/crate/${ crateId }/links`)

		const crate = res.data
		if (!crate) {
			return redirect('/home')
		}

		store.commit('SET_CURRENT_CRATE', crate)

		const links = res2.data

		return { crate, links }
	},
	data() {
		return {
			showAddModal: false,
			newLink: undefined,
			invalidLinkErr: undefined
		}
	},
	computed: {
		emojiIcon() {
			return emojis[this.crate.icon]
		}
	},
	methods: {
		addLink() {
			const value = this.newLink
			if (!value) return

			this.$store.dispatch('ADD_LINK', { url: value, crate: this.crate.key }).then((link) => {
				this.links.push(link)
				this.newLink = undefined
				this.showAddModal = false
			}).catch((err) => {
				this.invalidLinkErr = err.message
				console.log(err)
			})
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
		& p {
			margin-top: 0.3rem;
			color: var(--text-light);
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