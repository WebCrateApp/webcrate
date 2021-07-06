<template>
  <div class="crate-wrapper">
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
		const { data: res2 } = await $axios.get(`/api/crate/${ crateId }/links`)

		const crate = res.data
		if (!crate) {
			return redirect('/home')
		}

		const links = res2.data

		store.commit('SET_CURRENT_CRATE', crate)
		store.commit('SET_CURRENT_CRATE_LINKS', links)

		return { crate, links }
	},
	computed: {
		emojiIcon() {
			return emojis[this.crate.icon]
		}
	},
	methods: {
		showAddLinkModal() {
			this.$store.commit('SET_SHOW_ADD_LINK_MODAL', true)
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