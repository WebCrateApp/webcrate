<template>
  <div class="sidemenu">
    <div class="headline">
      <h1>{{ username }}'s WebCrate</h1>
    </div>
    <hr>
    <div class="menus">
      <SideBarMenuItem
        v-for="crate in mainMenuItems"
        :key="crate.key"
        :name="crate.name"
        :icon="crate.icon"
        :selected="currentCrate.key === crate.key"
        @click.native="changePage(crate)"
      />
    </div>
    <div class="section-title">
      <h4>My Crates</h4>
    </div>
    <div class="menus">
      <SideBarMenuItem
        v-for="crate in crates"
        :key="crate.key"
        :name="crate.name"
        :emoji="crate.icon"
        :selected="currentCrate.key === crate.key"
        @click.native="changeCrate(crate)"
      />
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			mainMenuItems: [
				{
					key: 'home',
					name: 'Home',
					icon: 'home'
				},
				{
					key: 'today',
					name: 'Today',
					icon: 'calendar'
				}
			]
		}
	},
	computed: {
		crates() {
			return this.$store.state.crates
		},
		username() {
			return this.$store.state.username
		},
		currentCrate: {
			set(value) {
				this.$store.commit('SET_CURRENT_CRATE', value)
			},
			get() {
				return this.$store.state.currentCrate
			}
		}
	},
	created() {
		this.$store.dispatch('GET_CRATES')
	},
	methods: {
		changeCrate(crate) {
			this.currentCrate = crate
			this.$router.push(`/crate/${ crate.key }`)
		},
		changePage(crate) {
			this.currentCrate = crate
			this.$router.push(`/${ crate.key }`)
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
	}

	.headline {
		text-align: center;

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
		text-align: left;
		width: 100%;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
</style>