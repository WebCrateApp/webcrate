<template>
  <transition name="fade" mode="in-out">
    <div v-if="!loadingCrates" key="loaded" class="sidemenu">
      <div class="logo-title">
        <a href="/">
          <img src="/icon.png" />
        </a>
        <h1>
          {{ config && config.name ? config.name : 'WebCrate' }}
        </h1>
        <ActionDropdown icon="dotsV" icon-size="18px" :no-padding="true" :actions="moreActions" />
      </div>
      <hr>
      <div v-shortkey="['ctrl', 's']" @shortkey="showModal('search')"></div>
      <div v-shortkey="['ctrl', 'h']" @shortkey="changePage('home')"></div>
      <div v-shortkey="['ctrl', 'alt', 'n']" @shortkey="showModal('addCrate')"></div>
      <div class="menus">
        <SideBarMenuItem name="Home" icon="home" :selected="currentPage === 'home'" @click.native="changePage('home')" @click.middle.native.stop="changePage('home', true)" />
        <SideBarMenuItem
          name="Inbox"
          icon="inbox"
          :selected="currentCrate === 'null'"
          crate-id="null"
          :editable="true"
          @click.native="changePage('null')"
          @click.middle.native.stop="changePage('inbox', true)"
        />
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
          :selected="currentCrate === crate.id && !currentPage"
          :editable="crate.id !== undefined && crate.endpoint === undefined"
          :error="crate.deleted"
          @click.native="changeCrate(crate)"
          @click.middle.native.stop="changeCrate(crate, true)"
          @shortkey.native="changeCrate(crate)"
        />
      </div>
      <div class="section-title">
        <h4>
          External Crates
        </h4>
        <Icon name="add" @click.native.stop="showAddExternalCrate" />
      </div>
      <div v-if="externalCrates && externalCrates.length > 0" class="menus">
        <SideBarMenuItem
          v-for="crate in externalCrates"
          :key="crate.id"
          :name="crate.name"
          :emoji="crate.icon"
          :crate-id="crate.id"
          :selected="currentCrate === crate.id"
          :editable="crate.id && !crate.endpoint"
          :error="crate.deleted"
          @click.native="changeCrate(crate)"
          @click.middle.native.stop="changeCrate(crate, true)"
          @shortkey.native="changeCrate(crate)"
        />
      </div>
      <div v-else class="empty-external">
        <h4>What is this?</h4>
        <p>External crates are crates which exist on another users WebCrate instance. You can subscribe to them to stay up to date with the latest additions.</p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else key="loading" class="sidemenu abs">
      <div class="headline">
        <LoadingItem height="25px" />
      </div>
      <hr>
      <div class="menus">
        <LoadingItem v-for="i in 2" :key="i" />
      </div>
      <div class="section-title">
        <LoadingItem height="28px" style="margin-top: -2px; margin-bottom: -5px;" />
      </div>
      <div class="menus">
        <LoadingItem v-for="i in 5" :key="i" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
	data() {
		return {
			externalExplanation: false,
			moreActions: [
				{
					text: 'Create new crate',
					icon: 'add',
					click: () => {
						this.showModal('addCrate')
					}
				},
				{
					text: 'Add external crate',
					icon: 'cloud',
					click: () => {
						this.showModal('addExternalCrate')
					}
				},
				{
					text: 'Change name',
					icon: 'edit',
					click: () => {
						this.showModal('changeName')
					}
				}
			]
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
		currentPage: {
			set(value) {
				this.$store.commit('SET_CURRENT_PAGE', value)
			},
			get() {
				return this.$store.state.currentPage
			}
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
		changeCrate(crate, newTab = false) {
			this.$switchToPageOrCrate(crate.id, { external: crate.endpoint !== undefined, newTab })
		},
		changePage(page, newTab = false) {
			this.$switchToPageOrCrate(page, { newTab })
		},
		showModal(value) {
			this.$modal.show(value)
		},
		showAddExternalCrate() {
			if (!this.externalCrates || this.externalCrates.length === 0) {
				this.$modal.show('addExternalCrate', { firstExternal: true })
				return
			}

			this.$modal.show('addExternalCrate')
		}
	}
}
</script>

<style lang="scss" scoped>
	::-webkit-scrollbar {
		width: 0.7rem;
	}

	::-webkit-scrollbar-thumb {
		background-color: var(--grey);
		border-radius: var(--border-radius);
		border: 0;
	}

	::-webkit-scrollbar-track {
		box-shadow: inset 0 0 4px var(--background-2nd);
	}

	@-moz-document url-prefix() {
		.scroller {
			scrollbar-width: thin;
			scrollbar-color: #1e202a;
		}
	}

	.sidemenu {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 1rem;
		overflow-y: auto;

		scrollbar-width: thin;
		scrollbar-color: var(--grey) var(--background-2nd);

		&.abs {
			position: absolute;
			z-index: 1;
			top: 0;
			left: 0;
			width: 100%;
		}
	}

	.logo-title {
		display: flex;
		align-items: center;
		width: 100%;
		height: 26px;
		position: relative;

		& img {
			width: 20px;
			height: 20px;
			background: var(--background);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		& h1 {
			font-size: 1rem;
			font-weight: 600;
			flex-grow: 1;
			text-align: center;
		}

		& div {
			margin-left: auto;
		}
	}

	hr {
		margin: 1rem 0;
		/* Wierd fix: without padding it will disapear when the scroll bar is shown */
		padding: 1.3px;
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

	.empty-external {
		background: var(--grey-light);
		border-radius: var(--border-radius);
		padding: 1rem;
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	.fade-enter-active, .fade-leave-active {
		transition: opacity .1s;
	}
	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
</style>