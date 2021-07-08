<template>
  <transition name="fade" mode="in-out">
    <div v-if="!loadingCrates" key="loaded" class="sidemenu">
      <div class="headline">
        <h1>
          {{ username }}'s WebCrate
        </h1>
      </div>
      <hr>
      <div class="menus">
        <SideBarMenuItem name="Home" icon="home" :selected="currentPage === 'home'" @click.native="changePage('home')" />
        <SideBarMenuItem name="Today" icon="calendar" :selected="currentPage === 'today'" @click.native="changePage('today')" />
        <SideBarMenuItem name="Quick Search" icon="search" @click.native.stop="showSearchModal = true" />
      </div>
      <div class="section-title">
        <h4>
          My Crates
        </h4>
        <Icon name="add" @click.native.stop="showAddNewCrateModal = true" />
      </div>
      <div class="menus">
        <SideBarMenuItem
          v-for="crate in crates"
          :key="crate.key"
          :name="crate.name"
          :emoji="crate.icon"
          :crate-id="crate.key"
          :selected="currentCrate === crate.key"
          @click.native="changeCrate(crate)"
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
		username() {
			return this.$store.state.username
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
		},
		showSearchModal: {
			set(value) {
				this.$store.commit('SET_SHOW_MODAL', { modal: 'search', value })
			},
			get() {
				return this.$store.state.modals.search
			}
		},
		showAddNewCrateModal: {
			set(value) {
				this.$store.commit('SET_SHOW_MODAL', { modal: 'addCrate', value })
			},
			get() {
				return this.$store.state.modals.addCrate
			}
		}
	},
	watch: {
		loadingCrates(newVal) {
			console.log(newVal)
		}
	},
	methods: {
		changeCrate(crate) {
			this.$store.commit('SET_CURRENT_CRATE', crate.key)
			this.currentPage = undefined
			this.$router.push(`/crate/${ crate.key }`)
		},
		changePage(page) {
			this.$store.commit('SET_CURRENT_CRATE', undefined)
			this.currentPage = page

			if (page === 'home') {
				this.$router.push(`/`)
				return
			}

			this.$router.push(`/${ page }`)
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