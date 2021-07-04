<template>
  <div class="sidemenu">
    <div class="headline">
      <h1>Maxi's WebCrate</h1>
    </div>
    <hr>
    <div class="menus">
      <SideBarMenuItem name="Home" icon="home" :selected="currentCrate === 'home'" @click.native="currentCrate = 'home'" />
      <SideBarMenuItem name="Today" :count="20" icon="calendar" :selected="currentCrate === 'today'" @click.native="currentCrate = 'today'" />
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
        :selected="currentCrate === crate.key"
        @click.native="currentCrate = crate.key"
      />
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			currentCrate: 'home'
			/* crates: [
				{
					key: '1',
					name: 'Read Later',
					icon: 'closed_book'
				},
				{
					key: '2',
					name: 'Design Resources',
					icon: 'crystal_ball'
				},
				{
					key: '3',
					name: 'Web Dev',
					icon: 'computer'
				},
				{
					key: '4',
					name: 'Road Trip',
					icon: 'car'
				},
				{
					key: '5',
					name: 'Archive',
					icon: 'file_folder'
				}
			] */
		}
	},
	computed: {
		crates() {
			return this.$store.state.crates
		}
	},
	created() {
		this.$store.dispatch('GET_CRATES')
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