<template>
  <transition name="fade" mode="in-out">
    <div v-if="!loadingCrates" key="loaded" class="sidemenu">
      <div class="headline">
        <h1>
          {{ config && config.name ? config.name : 'WebCrate' }}
        </h1>
      </div>
      <hr>
      <div v-shortkey="['ctrl', 's']" @shortkey="showModal('search')"></div>
      <div v-shortkey="['ctrl', 'h']" @shortkey="changePage('home')"></div>
      <div v-shortkey="['ctrl', 'alt', 'n']" @shortkey="showModal('addCrate')"></div>
      <div class="menus">
        <SideBarMenuItem name="Home" icon="home" :selected="currentPage === 'home'" @click.native="changePage('home')" />
        <SideBarMenuItem name="Inbox" icon="inbox" :selected="currentPage === 'inbox'" crate-id="null" @click.native="changePage('inbox')" />
        <SideBarMenuItem name="Quick Search" icon="search" @click.native.stop="showModal('search')" />
      </div>
      <div class="section-title">
        <h4>
          My Crates
        </h4>
        <Icon name="add" @click.native.stop="showModal('addCrate')" />
      </div>
      <div class="menus">
        <SideBarMenuItem
          v-for="(crate, idx) in crates"
          :key="crate.id"
          v-shortkey="['ctrl', idx + 1]"
          :name="crate.name"
          :emoji="crate.icon"
          :crate-id="crate.id"
          :selected="currentCrate === crate.id"
          @click.native="changeCrate(crate)"
          @shortkey.native="changeCrate(crate)"
        />
      </div>
      <div class="section-title">
        <h4>
          External Crates
        </h4>
        <Icon name="add" @click.native.stop="showModal('addExternalCrate')" />
      </div>
      <div class="menus">
        <SideBarMenuItem
          v-for="(crate, idx) in externalCrates"
          :key="crate.id"
          v-shortkey="['ctrl', idx + 1]"
          :name="crate.name"
          :emoji="crate.icon"
          :crate-id="crate.id"
          :selected="currentCrate === crate.id"
          @click.native="changeCrate(crate)"
          @shortkey.native="changeCrate(crate)"
        />
      </div>
    </div>

    <!-- Loading state -->
    <div v-else key="loading" class="sidemenu abs">
      <div class="headline">
        <SideBarLoadingItem height="25px" />
      </div>
      <hr>
      <div class="menus">
        <SideBarLoadingItem v-for="i in 2" :key="i" />
      </div>
      <div class="section-title">
        <SideBarLoadingItem height="28px" style="margin-top: -2px; margin-bottom: -5px;" />
      </div>
      <div class="menus">
        <SideBarLoadingItem v-for="i in 5" :key="i" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
	data() {
		return {
			currentPage: 'Home'
		}
	},
	computed: {
		crates() {
			return this.$store.state.crates
		},
		externalCrates() {
			return this.$store.state.externalCrates
		},
		config() {
			return this.$store.state.config
		},
		currentCrate() {
			return this.$store.state.currentCrate
		},
		loadingCrates: {
			set(value) {
				this.$store.commit('SET_LOADING_CRATES', value)
			},
			get() {
				return this.$store.state.loadingCrates
			}
		}
	},
	methods: {
		changeCrate(crate) {
			this.$store.commit('SET_CURRENT_CRATE', crate.id)
			this.currentPage = undefined

			if (crate.endpoint !== undefined) {
				this.$router.push(`/crate/external/${ crate.id }`)
				return
			}

			this.$router.push(`/crate/${ crate.id }`)
		},
		changePage(page) {
			this.$store.commit('SET_CURRENT_CRATE', undefined)
			this.currentPage = page

			if (page === 'home') {
				this.$router.push(`/`)
				return
			}

			this.$router.push(`/${ page }`)
		},
		showModal(value) {
			this.$modal.show(value)
		}
	}
}
</script>

<style lang="scss" scoped>
	.sidemenu {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 1rem;

		&.abs {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			width: 100%;
		}
	}

	.headline {
		text-align: center;
		width: 100%;
		height: 26px;

		& h1 {
			font-size: 1.2rem;
		}
	}

	hr {
		margin: 1rem 0;
	}

	.menus {
		width: 100%;
	}

	.section-title {
		width: 100%;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;

		& div {
			color: var(--text-light);
			margin-left: auto;
			transition: border .2s ease;
			border-radius: var(--border-radius);
			border: 2px solid var(--background-2nd);
			cursor: pointer;

			&:hover {
				border: 2px solid var(--grey);
				transition: none;
			}
		}
	}

	.fade-enter-active, .fade-leave-active {
		transition: opacity .1s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
</style>